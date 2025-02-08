import re

def extract_titles(sql_dump):
    # Regular expression patterns to match INSERT statements and relevant columns
    insert_pattern = re.compile(r"COPY (\w+)\.(\w+) \((.*?)\) FROM stdin;", re.DOTALL)
    data_pattern = re.compile(r"\d+\t(.*?)\t.*?\n", re.DOTALL)

    # Dictionary to store parsed data
    data = {}

    # Parse SQL dump to extract relevant data
    for match in insert_pattern.finditer(sql_dump):
        schema_name, table_name, columns = match.groups()
        if table_name.lower() in ['alias', 'admin_log']:
            data[table_name] = []
            for data_match in data_pattern.finditer(sql_dump):
                data[table_name].append(data_match.group(1))

    return data.get('alias', [])

def print_last_200_titles(titles):
    start_index = max(0, len(titles) - 200)
    for i, title in enumerate(titles[start_index:]):
        print(title)

def main():
    # Read SQL dump from file
    with open('latest.sql', 'r') as file:
        sql_dump = file.read()

    # Extract titles
    titles = extract_titles(sql_dump)

    # Print the last 200 titles
    print_last_200_titles(titles)

if __name__ == "__main__":
    main()
