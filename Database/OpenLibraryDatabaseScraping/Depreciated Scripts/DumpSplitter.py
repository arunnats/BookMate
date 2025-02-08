import os

def split_file(file_path, lines_per_file=100000):
    
    file_count = 1
    lines_written = 0

    split_dir = os.path.join(os.path.dirname(file_path), "splits")
    os.makedirs(split_dir, exist_ok=True)

    with open(file_path, 'r+') as file:
        split_file_name = os.path.join(split_dir, f'split_{file_count:04d}.txt')
        split_file = open(split_file_name, 'w')
        
        for line in file:
            split_file.write(line)
            lines_written += 1

            if lines_written == lines_per_file:
                split_file.close()
                print(f'Created: {split_file_name}')
                
                lines_written = 0
                file_count += 1
                split_file_name = os.path.join(split_dir, f'split_{file_count:04d}.txt')
                split_file = open(split_file_name, 'w')

        if not split_file.closed:
            split_file.close()
            print(f'Created: {split_file_name}')

    # Optionally, remove the original file to free up space
    os.remove(file_path)
    print(f"Deleted the original file: {file_path}")

file_path = "/media/arunnats/Storage/in/ol_dump_editions_2024-04-30.txt"  # Specify the path to your large file
split_file(file_path)
