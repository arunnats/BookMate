import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="nats",
    database="BookMate"
)
cursor = conn.cursor()

with open('./processed/filenames.txt', 'r') as file:
    for line in file:
        parts = line.split('\t')
        table_name = parts[0]
        files = parts[3].strip('{}').split(',')

        create_table_query = f"""
            CREATE TABLE Book( 
            Title VARCHAR(255), 
            ISBN VARCHAR(13), 
            Genres TEXT )
        """
        cursor.execute(create_table_query)
        
        for file_name in files:
            # Remove curly braces from file name
            file_name = file_name.strip('{}')

            load_data_query = f"""
                LOAD DATA INFILE '/var/lib/mysql-files/{file_name}'
                INTO TABLE Book
                FIELDS TERMINATED BY '\t'
                LINES TERMINATED BY '\n'
                IGNORE 1 LINES
                (Title, ISBN, Genres)
            """
            try:
                cursor.execute(load_data_query)
            except mysql.connector.Error as err:
                print(f"Error: {err}. Skipping file {file_name}.")
        
        # For some reason the last file wont work so I had to rename and load it separately
        load_data_query = f"""
                LOAD DATA INFILE '/var/lib/mysql-files/test.csv'
                INTO TABLE Book
                FIELDS TERMINATED BY '\t'
                LINES TERMINATED BY '\n'
                IGNORE 1 LINES
                (Title, ISBN, Genres)
            """
        cursor.execute(load_data_query)
                
        print(f"Finished processing {table_name} files.")

conn.commit()
cursor.close()
conn.close()
