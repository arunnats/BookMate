def find_isbn_and_print_next_lines(file_path, target_isbn, num_lines=10):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    print_lines = False
    line_count = 0

    for line in lines:
        if target_isbn in line:
            print("ISBN found: Printing the next 10 lines...")
            print_lines = True
            continue
        
        if print_lines and line_count < num_lines:
            print(line.strip())
            line_count += 1
        
        if line_count == num_lines:
            break

    if line_count == 0:
        print("ISBN not found in the file.")

file_path = "/media/arunnats/Storage/in/ol_dump_editions_2024-04-30.txt"  # Specify the path to your file
target_isbn = "9780101225021"
find_isbn_and_print_next_lines(file_path, target_isbn)
