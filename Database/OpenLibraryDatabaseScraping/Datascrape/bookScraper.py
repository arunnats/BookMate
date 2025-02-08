import requests
import pandas as pd
import time

# Interested subjects focused on fiction and related genres
interested_subjects = [
    'fiction', 'romance', 'young adult', 'fantasy', 'thrillers', 'suspense',
    'action and adventure', 'fantasy fiction', 'juvenile fiction', 'history',
    'literary fiction', 'love stories', 'erotic fiction', 'epic', 'crime',
    'horror', 'science fiction', 'coming of age', 'time travel', 'alternative history',
    'romantic comedy', 'comics', 'friendship', 'mystery'
]

# Set to store fetched book ISBNs
fetched_isbns = set()

# Function to fetch books for a subject with pagination and year filtering
def fetch_books_for_subject(subject, total_books_to_fetch=10000, start_year=2010):
    global fetched_isbns  # Access the global set of fetched ISBNs
    books = []
    offset = 0
    while len(books) < total_books_to_fetch:
        url = f"https://openlibrary.org/subjects/{subject}.json?limit=100&offset={offset}&published_in={start_year}-"
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error: {response.status_code}")
            break
        data = response.json()
        works = data.get('works', [])
        if not works:
            print("No more works found")
            break
        for work in works:
            isbn = work.get('cover_edition_key')
            if isbn not in fetched_isbns:
                books.append(work)
                fetched_isbns.add(isbn)
                if len(books) >= total_books_to_fetch:
                    break
        offset += 1000
        print(f"Fetched {len(books)} books for subject '{subject}' so far...")
        # Sleep to avoid hitting rate limits
        time.sleep(1)
    return books[:total_books_to_fetch]

# Fetch books for all subjects with a focus on recent publications
books = []
for subject in interested_subjects:
    books.extend(fetch_books_for_subject(subject))

# Parse book data
books_data = []
for book in books:
    book_info = {
        'ISBN': book.get('cover_edition_key'),
        'Book-Title': book.get('title'),
        'Book-Author': book.get('authors')[0]['name'] if book.get('authors') else None,
        'Year-Of-Publication': book.get('first_publish_year'),
        'Publisher': None,  # Open Library API doesn't provide publisher directly
        'Image-URL-S': f"http://covers.openlibrary.org/b/id/{book.get('cover_id')}-S.jpg" if book.get('cover_id') else None,
        'Image-URL-M': f"http://covers.openlibrary.org/b/id/{book.get('cover_id')}-M.jpg" if book.get('cover_id') else None,
        'Image-URL-L': f"http://covers.openlibrary.org/b/id/{book.get('cover_id')}-L.jpg" if book.get('cover_id') else None
    }
    books_data.append(book_info)

# Create DataFrame and save to CSV
books_df = pd.DataFrame(books_data)
books_df.to_csv('books.csv', index=False)
