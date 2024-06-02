import mysql.connector
import csv

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="nats",
    database="bookmate"
)
cursor = conn.cursor()

discarded_rows_count = 0
batch_size = 10000  # Number of rows to insert in a single batch
batch = []

with open('C:/Users/hiaru/Documents/GitHub/BookMate/Database/OpenLibraryDatabaseScraping/processed/filenames.txt', 'r') as file:
    for line in file:
        parts = line.split('\t')
        table_name = parts[0]
        files = parts[3].strip('{}').split(',')

        drop_table_query = """
            DROP TABLE IF EXISTS Book
        """
        cursor.execute(drop_table_query)

        create_table_query = """
            CREATE TABLE Book( 
                Title TEXT, 
                ISBN VARCHAR(20), 
                Genres TEXT,
                Author TEXT,
                AuthorID TEXT,
                Language TEXT
            )
        """
        cursor.execute(create_table_query)

        for file_name in files:
            # Remove curly braces from file name
            file_name = file_name.strip('{}')

            # Adjust the file path for Windows
            file_path = f'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/{file_name}'

            with open(file_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.reader(csvfile, delimiter='\t')
                next(reader)  # Skip header row

                for row in reader:
                    try:
                        batch.append(row)
                        if len(batch) >= batch_size:
                            cursor.executemany("""
                                INSERT INTO Book (Title, ISBN, Genres, Author, AuthorID, Language)
                                VALUES (%s, %s, %s, %s, %s, %s)
                            """, batch)
                            batch.clear()  # Clear the batch after inserting
                    except mysql.connector.Error as err:
                        print(f"Error: {err}. Skipping row: {row}")
                        discarded_rows_count += 1

                # Insert any remaining rows in the batch
                if batch:
                    cursor.executemany("""
                        INSERT INTO Book (Title, ISBN, Genres, Author, AuthorID, Language)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, batch)
                    batch.clear()

        print(f"Finished processing {table_name} files.")

# Print the total number of discarded rows
print(f"Total discarded rows: {discarded_rows_count}")

conn.commit()
cursor.close()
conn.close()
