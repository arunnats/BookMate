import urllib.request
import gzip
import os

# Function to download and extract the data
def download_and_extract_data(url, destination_folder):
    # Download the gzip file
    print("Downloading data...")
    urllib.request.urlretrieve(url, os.path.join(destination_folder, "ol_dump_editions_latest.txt.gz"))
    
    # Extract the gzip file
    print("Extracting data...")
    with gzip.open(os.path.join(destination_folder, "ol_dump_editions_latest.txt.gz"), 'rb') as f_in:
        with open(os.path.join(destination_folder, "ol_dump_editions_latest.txt"), 'wb') as f_out:
            f_out.write(f_in.read())

if __name__ == "__main__":
    open_library_dump_url = "https://openlibrary.org/data/ol_dump_editions_latest.txt.gz"

    destination_folder = os.getcwd()

    download_and_extract_data(open_library_dump_url, destination_folder)
