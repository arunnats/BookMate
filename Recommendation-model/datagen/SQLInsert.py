import pandas as pd
from sqlalchemy import create_engine

# Connect to MySQL database using SQLAlchemy
engine = create_engine('mysql+mysqlconnector://root:nats@localhost/bookmate')

def load_data():
    books = pd.read_csv('../dataset/Books.csv', dtype={'ISBN': str, 'Book-Title': str, 'Book-Author': str, 'Year-Of-Publication': str, 'Publisher': str, 'Image-URL-S': str, 'Image-URL-M': str, 'Image-URL-L': str})
    users = pd.read_csv('../dataset/Users.csv', dtype={'User-ID': int, 'Location': str, 'Age': str})
    ratings = pd.read_csv('../dataset/Ratings.csv', dtype={'User-ID': int, 'ISBN': str, 'Book-Rating': float})
    return books, users, ratings

def preprocess_and_insert_data(books, ratings):
    ratings_with_name = ratings.merge(books, on='ISBN')
    num_rating_df = ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
    num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)
    
    avg_rating_df = ratings_with_name.groupby('Book-Title')['Book-Rating'].mean().reset_index()
    avg_rating_df.rename(columns={'Book-Rating': 'avg_rating'}, inplace=True)
    
    popular_df = num_rating_df.merge(avg_rating_df, on='Book-Title')
    popular_df = popular_df[popular_df['num_ratings'] >= 250].sort_values('avg_rating', ascending=False).head(50)
    popular_df = popular_df.merge(books, on='Book-Title').drop_duplicates('Book-Title')[['ISBN', 'Book-Title', 'Book-Author', 'Image-URL-M', 'num_ratings', 'avg_rating']]
    
    x = ratings_with_name.groupby('User-ID').count()['Book-Rating'] > 200
    top_users = x[x].index
    filtered_rating = ratings_with_name[ratings_with_name['User-ID'].isin(top_users)]
    
    y = filtered_rating.groupby('Book-Title').count()['Book-Rating'] >= 50
    top_books = y[y].index
    final_ratings = filtered_rating[filtered_rating['Book-Title'].isin(top_books)]
    
    final_df = final_ratings.merge(popular_df, on='Book-Title', how='left')
    
    final_df.to_sql(name='top_books', con=engine, if_exists='replace', index=False)
    print("Data inserted into database successfully.")

if __name__ == "__main__":
    books, users, ratings = load_data()
    preprocess_and_insert_data(books, ratings)
