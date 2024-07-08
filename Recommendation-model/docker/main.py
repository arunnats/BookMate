import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
def load_precomputed_data():
    global app
    print("Loading precomputed correlation matrix and ratings...")
    # app.state.books = pd.read_pickle('./books.pkl')
    app.state.pt = pd.read_pickle('./pivot_table.pkl')
    app.state.similarity_scores = np.load('./similarity_scores.npy')
    app.state.top_50 = pd.read_csv('./popular_books.csv')
    
    print("Connecting to database...")
    
    db_connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
        
    app.state.books = pd.read_sql('SELECT * FROM top_books', con=db_connection)
    
    
    db_connection.close()
    
    print("Precomputed data loaded successfully.")
    
def calculate_library_similarity(lib1, lib2):
    global app
    lib1_books = lib1.split(',')
    lib2_books = lib2.split(',')
    
    print("Lib1")
    print(lib1_books)
    
    print("Lib2")
    print(lib2_books)
    
    sim_scores = []
    for book1 in lib1_books:
        index1 = np.where(app.state.books['ISBN'] == book1)[0]
        if len(index1) == 0:
            print(f"Book {book1} not found in books DataFrame.")
            continue
        index1 = index1[0]
        
        for book2 in lib2_books:
            index2 = np.where(app.state.books['ISBN'] == book2)[0]
            if len(index2) == 0:
                print(f"Book {book2} not found in books DataFrame.")
                continue
            index2 = index2[0]
            
            print(index1)
            print(index2)
            print(app.state.similarity_scores[index1][index2])
            sim_scores.append(app.state.similarity_scores[index1][index2])
    
    if sim_scores:
        return np.mean(sim_scores)
    else:
        return 0
    
def calculate_answer_similarity(ans1, ans2):
    if len(ans1) != len(ans2):
        raise ValueError("Answer strings must be of the same length.")
    
    matches = sum(1 for a, b in zip(ans1, ans2) if a == b)
    return matches / len(ans1)

def pair_users(users_df, library_df):
    
    
    
    user_similarities = {}
    
    for i, user1 in users_df.iterrows():
        lib1 = library_df[library_df['id'] == user1['id']]['Fave_Books'].values[0]
        ans1 = library_df[library_df['id'] == user1['id']]['answers'].values[0]
        
        for j, user2 in users_df.iterrows():
            if i >= j:
                continue
            
            lib2 = library_df[library_df['id'] == user2['id']]['Fave_Books'].values[0]
            ans2 = library_df[library_df['id'] == user2['id']]['answers'].values[0]
            
            lib_similarity = calculate_library_similarity(lib1, lib2)
            ans_similarity = calculate_answer_similarity(ans1, ans2)
            
            overall_similarity = (lib_similarity * 0.65) + (ans_similarity * 0.35)
            user_similarities[(user1['id'], user2['id'])] = overall_similarity
    
    sorted_pairs = sorted(user_similarities.items(), key=lambda x: x[1], reverse=True)
    
    paired_users = []
    used_users = set()
    
    for (user1, user2), similarity in sorted_pairs:
        if user1 not in used_users and user2 not in used_users:
            paired_users.append((user1, user2, similarity))
            used_users.add(user1)
            used_users.add(user2)
    
    return paired_users

def calculate_matches():
    global app
    
    db_connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    
    app.state.users_df = pd.read_sql('SELECT * FROM users', con=db_connection)
    app.state.library_df = pd.read_sql('SELECT * FROM library', con=db_connection)
    
    app.state.users_df = app.state.users_df[app.state.users_df['opted_in'] != 0]
    
    paired_users = pair_users(app.state.users_df, app.state.library_df)
    for user1, user2, similarity in paired_users:
        print(f"Paired User {user1} with User {user2} (Similarity: {similarity:.2f})")
    
    update_query = """
    UPDATE users SET BookmateID = %s WHERE id = %s
    """
    
    cursor = db_connection.cursor()

    for user1, user2, similarity in paired_users:
        cursor.execute(update_query, (user2, user1))
        cursor.execute(update_query, (user1, user2))
    
    db_connection.commit()  
    cursor.close()      
    db_connection.close()  

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_precomputed_data()
    yield

app.router.lifespan_context = lifespan

@app.get("/make-matches/")
async def make_matches():
    print("Request received for making matches.")
    
    calculate_matches()
    
    print("Matches updated successfully")

@app.get("/recommend/")
async def get_recommendations(book_title: str):
    print(f"Recommendation request received for book title: '{book_title}'")
    
    if book_title not in app.state.pt.index:
        print(f"Book '{book_title}' not found in the pivot table.")
        return {"error": f"Book '{book_title}' not found in the pivot table."}
    
    index = np.where(app.state.pt.index == book_title)[0][0]
    similar_items = sorted(list(enumerate(app.state.similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:11]
    
    data = []
    for i in similar_items:
        item = []
        temp_df = app.state.books[app.state.books['Book-Title'] == app.state.pt.index[i[0]]]
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Author'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Year-Of-Publication'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['ISBN'].values))
        
        data.append(item)
    
    print(f"Recommendations generated successfully for book title: '{book_title}'")
    return data

@app.get("/top-books/")
async def get_top_books():
    print("Request received for top books.")
    
    data = []
    
    for _, row in app.state.top_50.iterrows():
        item = [row['Book-Title'], row['Book-Author'], row['Image-URL-M'], row['num_ratings'], row['avg_rating']]
        data.append(item)
    
    print("Top books generated successfully")
    return data

@app.get("/random-books/")
async def get_random_books():
    print("Request received for random books.")
    
    books_in_pivot_table = app.state.books[app.state.books['Book-Title'].isin(app.state.pt.index)]
    random_books = books_in_pivot_table.sample(n=10)
    
    data = []
    for _, row in random_books.iterrows():
        item = [row['Book-Title'], row['Book-Author'], row['Image-URL-M'], row['ISBN']]
        data.append(item)
    
    print("Random books generated successfully.")
    return data
