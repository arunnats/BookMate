import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def load_data():
    books = pd.read_csv('../dataset/Books.csv', dtype={'ISBN': str, 'Book-Title': str, 'Book-Author': str, 'Year-Of-Publication': str, 'Publisher': str, 'Image-URL-S': str, 'Image-URL-M': str, 'Image-URL-L': str})
    users = pd.read_csv('../dataset/Users.csv', dtype={'User-ID': int, 'Location': str, 'Age': str})
    ratings = pd.read_csv('../dataset/Ratings.csv', dtype={'User-ID': int, 'ISBN': str, 'Book-Rating': float})
    return books, users, ratings

def preprocess_data(books, ratings):
    ratings_with_name = ratings.merge(books, on='ISBN')
    
    num_rating_df = ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
    num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)
    
    avg_rating_df = ratings_with_name.groupby('Book-Title')['Book-Rating'].agg(lambda x: x.astype(float).mean()).reset_index()
    avg_rating_df.rename(columns = {'Book-Rating' : 'avg_rating'}, inplace = True)
    
    popular_df = num_rating_df.merge(avg_rating_df, on='Book-Title')
    popular_df = popular_df[popular_df['num_ratings'] >= 200].sort_values('avg_rating', ascending=False).head(50)
    popular_df = popular_df.merge(books, on='Book-Title')
    popular_df = popular_df.drop_duplicates('Book-Title')[['Book-Title', 'Book-Author', 'Image-URL-M', 'num_ratings', 'avg_rating']]
    
    x = ratings_with_name.groupby('User-ID').count()['Book-Rating'] > 15
    top_users = x[x].index
    filtered_rating = ratings_with_name[ratings_with_name['User-ID'].isin(top_users)]
    
    y = filtered_rating.groupby('Book-Title').count()['Book-Rating'] > 10
    top_books = y[y].index
    
    final_ratings = filtered_rating[filtered_rating['Book-Title'].isin(top_books)]
    
    pt = final_ratings.pivot_table(index='Book-Title', columns='User-ID', values='Book-Rating')
    pt.fillna(0, inplace=True)
    
    similarity_scores = cosine_similarity(pt)
    
    np.save('similarity_scores.npy', similarity_scores)  
    pt.to_pickle('pivot_table.pkl')                    
    books.to_pickle('books.pkl')        
    popular_df.to_csv('popular_books.csv')           
    print("Books and Similarity Scores and Pivot Table saved to disk.")

if __name__ == "__main__":
    books, users, ratings = load_data()
    preprocess_data(books, ratings)
