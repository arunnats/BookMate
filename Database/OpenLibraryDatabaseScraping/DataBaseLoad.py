import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="nats",
    database="bookmate"
)
cursor = conn.cursor()

with open('C:/Users/hiaru/Documents/GitHub/BookMate/Database/OpenLibraryDatabaseScraping/processed/filenames.txt', 'r') as file:
    for line in file:
        parts = line.split('\t')
        table_name = parts[0]
        files = parts[3].strip('{}').split(',')
        
        drop_table_query = f"""
            DROP TABLE IF EXISTS Book
        """
        cursor.execute(drop_table_query)
        
        create_table_query = f"""
            CREATE TABLE Book( 
            Title TEXT, 
            ISBN VARCHAR(20), 
            Genres TEXT,
            Author TEXT,
            AuthorID TEXT,
            Language TEXT)
        """
        cursor.execute(create_table_query)
        
        for file_name in files:
            # Remove curly braces from file name
            file_name = file_name.strip('{}')

            # Adjust the file path for Windows
            file_path = f'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/{file_name}'

            load_data_query = f"""
                LOAD DATA INFILE '{file_path}'
                INTO TABLE Book
                FIELDS TERMINATED BY '\t'
                LINES TERMINATED BY '\n'
                IGNORE 1 LINES
                (Title, ISBN, Genres, Author, AuthorID, Language)
            """
            try:
                cursor.execute(load_data_query) 
            except mysql.connector.Error as err:
                print(f"Error: {err}. Skipping file {file_name}.")
        
        # For some reason the last file wont work so I had to rename and load it separately
        load_data_query = f"""
                LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/temp.csv'
                INTO TABLE Book
                FIELDS TERMINATED BY '\t'
                LINES TERMINATED BY '\n'
                IGNORE 1 LINES
                (Title, ISBN, Genres, Author, AuthorID, Language)
            """
        cursor.execute(load_data_query)
                
        print(f"Finished processing {table_name} files.")

conn.commit()
cursor.close()
conn.close()
