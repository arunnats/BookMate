import re

def parse_sql_file(sql_file_path):
    # Read the SQL file
    with open(sql_file_path, 'r') as file:
        sql_content = file.read()

    # Split SQL content into individual statements
    sql_statements = sql_content.split(';')

    # Regular expression pattern to match CREATE TABLE statements
    create_table_pattern = re.compile(r'CREATE TABLE `([^`]+)` \((.*?)\);', re.DOTALL)

    # Dictionary to store table schemas
    table_schemas = {}

    # Iterate through SQL statements
    for statement in sql_statements:
        # Match CREATE TABLE statements
        match = create_table_pattern.search(statement)
        if match:
            table_name = match.group(1)
            columns = match.group(2)
            # Extract column names
            column_names = re.findall(r'`([^`]+)`', columns)
            table_schemas[table_name] = column_names

    return table_schemas

def main():
    sql_file_path = 'latest.sql'

    # Parse the SQL file
    table_schemas = parse_sql_file(sql_file_path)

    # Display table schemas
    for table_name, columns in table_schemas.items():
        print(f'Table: {table_name}')
        print('Columns:')
        for column in columns:
            print(f'  - {column}')
        print()

if __name__ == "__main__":
    main()
