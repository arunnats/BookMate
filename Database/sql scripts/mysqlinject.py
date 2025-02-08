import mysql.connector
import csv

# Database connection details
DB_HOST = "db.api.bookmate.arunnats.com"
DB_USER = "remote"
DB_PASSWORD = "nats"
DB_NAME = "bookmate"

# CSV file path
CSV_FILE = "./top_books_data.csv"

def create_tables(cursor):
    """Create all necessary tables if they don't exist"""
    
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        LibID VARCHAR(25),
        email VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        picture_url TEXT,
        created_at DATETIME,
        phone_num VARCHAR(20),
        instagram VARCHAR(255),
        nickname VARCHAR(255),
        opted_in BOOLEAN DEFAULT FALSE,
        profile_done BOOLEAN DEFAULT FALSE,
        BookmateID VARCHAR(255),
        instagram_public BOOLEAN,
        phone_public BOOLEAN,
        email_public BOOLEAN
    )
    """)
    
    # Create library table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS library (
        LibID VARCHAR(25) PRIMARY KEY,
        id VARCHAR(255),
        Fave_Books TEXT,
        Wish_List TEXT,
        answers TEXT,
        FOREIGN KEY (id) REFERENCES users(id)
    )
    """)
    
    # Create top_books table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS top_books (
        ISBN VARCHAR(13) PRIMARY KEY,
        `Book-Title` VARCHAR(255),
        `Book-Author` VARCHAR(255),
        `Image-URL-M` TEXT,
        `Year-Of-Publication` VARCHAR(255),
        num_ratings INT,
        avg_rating FLOAT
    )
    """)

def insert_data(cursor):
    """Insert data from CSV into top_books"""
    insert_query = """
    INSERT INTO top_books (
        ISBN, 
        `Book-Title`, 
        `Book-Author`, 
        `Image-URL-M`, 
        `Year-Of-Publication`, 
        num_ratings, 
        avg_rating
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE 
        `Book-Title` = VALUES(`Book-Title`),
        `Book-Author` = VALUES(`Book-Author`),
        `Image-URL-M` = VALUES(`Image-URL-M`),
        `Year-Of-Publication` = VALUES(`Year-Of-Publication`),
        num_ratings = VALUES(num_ratings),
        avg_rating = VALUES(avg_rating);
    """

    with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter='\t')
        for line_number, row in enumerate(reader, start=1):
            try:
                if len(row) < 10:
                    print(f"Skipping incomplete row {line_number}: {row}")
                    continue

                # Adjusted column mapping based on schema
                isbn = row[1]
                title = row[3]
                author = row[4]
                year = row[5]
                img_m = row[8]
                num_ratings = int(row[2]) if row[2].isdigit() else 0
                avg_rating = float(row[2]) if row[2].replace('.','',1).isdigit() else 0.0

                cursor.execute(insert_query, (
                    isbn,
                    title,
                    author,
                    img_m,
                    year,
                    num_ratings,
                    avg_rating
                ))
                print(f"Processed row {line_number}: {isbn}")

            except Exception as e:
                print(f"Error processing row {line_number}: {e}")

def main():
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor()

    try:
        print("Creating tables...")
        create_tables(cursor)
        
        print("Inserting data into top_books...")
        insert_data(cursor)
        
        conn.commit()
        print("Operation completed successfully")
        
    except Exception as e:
        conn.rollback()
        print(f"Transaction failed: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
