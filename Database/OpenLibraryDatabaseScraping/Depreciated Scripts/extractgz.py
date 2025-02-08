import gzip
import os

# Function to download and extract the data
def extract_data(file_name, destination_folder):

    # Extract the gzip file
    print("Extracting data...")
    with gzip.open(os.path.join(destination_folder, file_name), 'rb') as f_in:
        with open(os.path.join(destination_folder, "ol_dump_editions_latest.txt"), 'wb') as f_out:
            f_out.write(f_in.read())

if __name__ == "__main__":
    file_name = "ol_dump_editions_2024-04-30.txt.gz"
    destination_folder = os.getcwd()

    extract_data(file_name, destination_folder)
