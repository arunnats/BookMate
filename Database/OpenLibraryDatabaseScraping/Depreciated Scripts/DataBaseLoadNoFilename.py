import os
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="nats",
    database="bookmate"
)
cursor = conn.cursor()

folder_path = 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads'

csv_files = [file for file in os.listdir(folder_path) if file.endswith('.csv')]

for csv_file in csv_files:
    table_name = os.path.splitext(csv_file)[0]

    create_table_query = f"""   
        CREATE TABLE IF NOT EXISTS {table_name} ( 
        Title VARCHAR(255), 
        ISBN VARCHAR(13), 
        Genres TEXT )
    """
    cursor.execute(create_table_query)

    load_data_query = f"""
        LOAD DATA INFILE '{os.path.join(folder_path, csv_file)}'
        INTO TABLE {table_name}
        FIELDS TERMINATED BY '\t'
        LINES TERMINATED BY '\n'
        IGNORE 1 LINES
        (Title, ISBN, Genres)
    """
    try:
        cursor.execute(load_data_query)
        print(f"Successfully loaded data from {csv_file} into table {table_name}.")
    except mysql.connector.Error as err:
        print(f"Error: {err}. Skipping file {csv_file}.")

conn.commit()
cursor.close()
conn.close()

#LOAD DATA INFILE 'C:\ProgramData\MySQL\MySQL Server 8.0\Uploads\editions_2000000.csv' INTO TABLE book FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 LINES (Title, ISBN, Genres);