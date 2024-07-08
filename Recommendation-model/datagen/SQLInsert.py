import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('mysql+mysqlconnector://root:nats@localhost/bookmate')

def load_data():
    books = pd.read_csv('../dataset/Books.csv', dtype={'ISBN': str, 'Book-Title': str, 'Book-Author': str, 'Year-Of-Publication': str, 'Publisher': str, 'Image-URL-S': str, 'Image-URL-M': str, 'Image-URL-L': str})
    users = pd.read_csv('../dataset/Users.csv', dtype={'User-ID': int, 'Location': str, 'Age': str})
    ratings = pd.read_csv('../dataset/Ratings.csv', dtype={'User-ID': int, 'ISBN': str, 'Book-Rating': float})
    return books, users, ratings

def preprocess_and_insert_data(books, ratings):
    ratings_with_name = ratings.merge(books, on='ISBN')
    
    num_rating_df = ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
    num_rating_df.rename(columns={'Book-Rating':'num_ratings'},inplace=True)

    avg_rating_df = ratings_with_name.groupby('Book-Title')['Book-Rating'].agg(lambda x: x.astype(float).mean()).reset_index()
    avg_rating_df.rename(columns = {'Book-Rating' : 'avg_rating'}, inplace = True)
    
    x = ratings_with_name.groupby('User-ID').count()['Book-Rating'] > 20
    top_users = x[x].index
    filtered_rating = ratings_with_name[ratings_with_name['User-ID'].isin(top_users)]
    
    y = filtered_rating.groupby('Book-Title').count()['Book-Rating'] > 15
    top_books = y[y].index
    
    final_ratings = filtered_rating[filtered_rating['Book-Title'].isin(top_books)]
    final_ratings = final_ratings.drop_duplicates(subset='ISBN', keep='first')
    final_ratings = final_ratings.drop_duplicates(subset='Book-Title', keep='first')
    
    final_ratings.to_sql(name='top_books', con=engine, if_exists='replace', index=False)
    print("Data inserted into database successfully.")

if __name__ == "__main__":
    books, users, ratings = load_data()
    preprocess_and_insert_data(books, ratings)
