import re
import csv

def parse_sql_file(sql_file_path):
    # Read the SQL file
    with open(sql_file_path, 'r') as file:
        sql_content = file.read()

    # Regular expression pattern to match INSERT INTO statements
    insert_pattern = re.compile(r'INSERT INTO `([^`]+)` VALUES \((.*?)\);')

    # List to store extracted data
    data = []

    # Iterate through INSERT INTO statements
    for match in insert_pattern.finditer(sql_content):
        table_name = match.group(1)
        values_str = match.group(2)

        # Split values string and remove quotes
        values = [value.strip("'") for value in values_str.split(',')]

        # Append table name and values to data list
        data.append((table_name, values))

    return data

def write_to_csv(data, csv_file_path):
    # Write data to CSV file
    with open(csv_file_path, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for table_name, values in data:
            # Write table name as header
            writer.writerow([f'Table: {table_name}'])
            # Write values
            writer.writerow(values)
            # Add an empty row for readability
            writer.writerow([])

def main():
    sql_file_path = 'latest.sql'
    csv_file_path = 'output.csv'

    # Parse the SQL file
    data = parse_sql_file(sql_file_path)

    # Write data to CSV file
    write_to_csv(data, csv_file_path)

    print(f'CSV file saved: {csv_file_path}')

if __name__ == "__main__":
    main()
