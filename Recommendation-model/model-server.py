from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pandas as pd
import random
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
    app.state.books = pd.read_pickle('./datagen/books.pkl')
    app.state.pt = pd.read_pickle('./datagen/pivot_table.pkl')
    app.state.similarity_scores = np.load('./datagen/similarity_scores.npy')
    print("Precomputed data loaded.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_precomputed_data()
    yield

app.router.lifespan_context = lifespan

@app.get("/recommend/")
async def get_usage(book_title: str):
    if book_title not in app.state.pt.index:
        return f"Book '{book_title}' not found in the pivot table."
    
    index = np.where(app.state.pt.index == book_title)[0][0]
    similar_items = sorted(list(enumerate(app.state.similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:11]
    
    data = []
    for i in similar_items:
        item = []
        temp_df = app.state.app.state.books[app.state.books['Book-Title'] == app.state.pt.index[i[0]]]
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Title'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Book-Author'].values))
        item.extend(list(temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values))
        
        data.append(item)
    
    return data

@app.get("/random-movies/")
async def get_random_movies():
    random_movies = random.sample(list(app.state.corr_matrix.columns), 10)
    return {"random_movies": random_movies}