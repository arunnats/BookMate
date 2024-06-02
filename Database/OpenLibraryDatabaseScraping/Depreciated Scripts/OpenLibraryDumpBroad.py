import csv
import ctypes as ct
import os
import json
import difflib
import re

csv.field_size_limit(int(ct.c_ulong(-1).value // 2))

LINES_PER_FILE = 2000000

INPUT_PATH = "/media/arunnats/Storage/in"
OUTPUT_PATH = "/media/arunnats/Storage/out"
FILE_IDENTIFIERS = ['editions_2024-04-30']

# Genre mapping for broad categories
genre_mapping = {
    'Romance': [
        'manwoman relationships fiction', 'romance general', 'fiction romance', 'fiction romance contemporary', 
        'fiction erotica general', 'romance', 'love', 'romantic comedy', 'romantic suspense', 'historical romance', 
        'romance: contemporary', 'romance: historical', 'romance: regency', 'erotica', 'love stories', 'erotic fiction', 
        'fiction romance general', 'dark fantasy', 'fiction romance suspense', 'romance literature', 
        'fiction romance historical general'
    ],
    'Thriller': [
        'fiction thrillers', 'thriller', 'suspense', 'mystery', 'crime', 'detective', 'psychological thriller', 
        'thrillers & suspense', 'fiction thrillers general', 'fiction thrillers suspense', 'action and adventure fiction', 
        'fiction suspense'
    ],
    'Fantasy': [
        'fiction fantasy general', 'fantasy', 'magic', 'witches', 'wizards', 'epic fantasy', 'urban fantasy', 'westerns', 
        'american drama', 'fantasy fiction', 'imaginary places', 'juvenile fantasy fiction'
    ],
    'Science Fiction': [
        'science fiction', 'sci-fi', 'space opera', 'dystopian', 'cyberpunk', 'good and evil', 'time travel', 
        'alternative history'
    ],
    'Historical Fiction': [
        'fiction historical general', 'historical fiction', 'historical', 'world war ii', 'historical mystery', 
        'alternative history', 'fiction romance historical general'
    ],
    'Young Adult': [
        'young adult', 'teen', 'coming of age', 'ya fiction', 'ya romance', 'teen & young adult', 'young adult fiction', 
        'teenage girls', 'juvenile fiction', 'dark fantasy', 'homosexuality', 'good and evil', 'friendship'
    ],
    'Horror': [
        'horror', 'supernatural', 'vampires', 'zombies', 'ghosts', 'post apocalyptic', 'gothic', 'horror fiction', 
        'horror tales', 'fiction horror'
    ],
    'Mystery': [
        'fiction mystery detective general', 'mystery', 'detective', 'crime', 'cozy mystery', 'whodunit', 'women sleuths', 
        'detective stories', 'mystery and detective stories', 'fiction mystery & detective traditional', 'crime novel'
    ],
    'Adventure': [
        'adventure', 'action', 'quest', 'treasure hunt', 'exploration', 'action & adventure', 'action and adventure fiction', 
        'fiction action adventure'
    ],
    'Literary Fiction': [
        'general literary fiction', 'literary fiction', 'contemporary fiction', 'realistic fiction', 'literature & fiction', 
        'american drama', 'romans, nouvelles', 'epic', 'epic literature', 'novel', 'hindu mythology', 'homosexuality', 
        'fiction in english', 'fiction lgbtq gay', 'fiction', 'fiction short stories single author', 'fiction humorous general'
    ],
    'Humor': [
        'humor', 'comedy', 'satire', 'funny', 'parody'
    ],
    'Biography': [
        'biography', 'autobiography', 'memoir', 'personal memoir', 'life story'
    ],
    'Classics': [
        'classics', 'literature - classics / criticism'
    ],
    'Children': [
        'short stories', 'child and youth fiction', 'comics graphic novels general', 'childrens fiction', 'child', 'children', 
        'reading level grade 9', 'reading level grade 8', 'reading level grade 11', 'reading level grade 10', 
        'reading level grade 12', 'comics', 'comic books, strips', 'friendship', 'juvenile', 'family'
    ],
    'General': [
        'fiction general', 'fiction lgbtq gay', 'comics graphic novels general', 'fiction', 'general', 
        'general literary fiction'
    ],
    'Other': [
        'non-classifiable', 'nonclassifiable', 'sale books', 'nonfiction general', 'nonfiction general'
    ]  # Default category for remaining genres
}

# Convert interested and uninterested subjects to sets for O(1) lookups
interested_subjects = {
    'fiction', 'romance', 'young adult', 'fantasy', 'thrillers', 'suspense',
    'action and adventure', 'fantasy fiction', 'juvenile fiction', 'history',
    'literary fiction', 'love stories', 'erotic fiction', 'epic', 'crime',
    'horror', 'science fiction', 'coming of age', 'time travel', 'alternative history',
    'romantic comedy', 'comics', 'friendship', 'mystery'
}
uninterested_subjects = {
    'History', 'Military', 'USA', 'United States', 'Japan', 'Science', 'Geology', 'Mathematics',
    'Medicine', 'Psychology', 'Engineering', 'Business', 'Economics', 'Finance', 'Accounting',
    'Management', 'Marketing', 'Entrepreneurship', 'Sociology', 'Politics', 'Philosophy',
    'Religion', 'Law', 'Education', 'Geography', 'Art', 'Music', 'Languages', 'Travel', 'Cooking',
    'Guide', 'World', 'Geopolitics', 'Culture', 'Biography', 'Health', 'Technology',
    'Computer Science', 'Programming', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Help'
}

interested_subjects = set(map(str.lower, interested_subjects))
uninterested_subjects = set(map(str.lower, uninterested_subjects))

# Function to clean and preprocess genres
def clean_genre(genre_list):
    clean_list = []
    for genre in genre_list:
        genre = genre.lower()
        genre = re.sub(r'[^a-zA-Z0-9\s]', '', genre)
        genre = re.sub(r'\s+', ' ', genre).strip()
        clean_list.append(genre)
    return clean_list

# Function to match genres to broad categories using Levenshtein similarity
def match_genre(genre_label, genre_mapping):
    matched_genres = set()
    for category, genres in genre_mapping.items():
        for genre in genres:
            if genre in genre_label:
                matched_genres.add(category)
                break
    for category, genres in genre_mapping.items():
        for genre in genres:
            similarity = difflib.SequenceMatcher(None, genre_label, genre).ratio()
            if similarity > 0.7:
                matched_genres.add(category)
                break
    if not matched_genres:
        matched_genres.add('Other')
    return list(matched_genres)

def is_similar(subject, target_set, threshold=0.7):
    subject_lower = subject.lower()
    if subject_lower in target_set:
        return True
    for target in target_set:
        if subject_lower in target or target in subject_lower:
            return True
        similarity = difflib.SequenceMatcher(None, subject_lower, target).ratio()
        if similarity >= threshold:
            return True
    return False

def run():
    filenames_array = []
    file_id = 0
    for identifier in FILE_IDENTIFIERS:
        print('Currently processing ', identifier)
        filenames = []
        csvoutputfile = None

        with open(os.path.join(INPUT_PATH, ('ol_dump_' + identifier + '.txt')), encoding="utf-8") as cvsinputfile:
            reader = csv.reader(cvsinputfile, delimiter='\t')

            for line, row in enumerate(reader):
                if line % LINES_PER_FILE == 0:
                    if csvoutputfile:
                        csvoutputfile.close()

                    filename = identifier + '_{}.csv'.format(line + LINES_PER_FILE)
                    filenames.append(filename)
                    csvoutput = open(os.path.join(OUTPUT_PATH, filename), "w", newline="", encoding="utf-8")
                    writer = csv.writer(csvoutput, delimiter='\t', quotechar='|', quoting=csv.QUOTE_MINIMAL)
                    writer.writerow(['Title', 'ISBN', 'Subjects', 'Author', 'Author_ID', 'Languages', 'Broad_Genres'])

                if len(row) > 4:
                    json_data = json.loads(row[4])
                    if 'title' in json_data and 'subjects' in json_data:
                        subjects = json_data['subjects']
                        clean_subjects = clean_genre(subjects)
                        broad_genres = set()
                        if not any(is_similar(subject, uninterested_subjects) for subject in clean_subjects):
                            if any(is_similar(subject, interested_subjects) for subject in clean_subjects):
                                broad_genres = {genre for subject in clean_subjects for genre in match_genre(subject, genre_mapping)}
                                title = json_data['title']
                                isbn = json_data['isbn_13'][0] if 'isbn_13' in json_data and len(json_data['isbn_13']) > 0 else ''
                                subjects_str = '|'.join(subjects)
                                                                # Assuming author information is also in json_data
                                author = json_data.get('authors', [{}])[0].get('name', '')
                                author_id = json_data.get('authors', [{}])[0].get('id', '')

                                # Assuming language handling is simple
                                languages = json_data.get('languages', [])
                                languages_str = '|'.join(lang.get('key', '').replace('/languages/', '') for lang in languages)

                                # Write the processed data to the output CSV file
                                writer.writerow([title, isbn, subjects_str, author, author_id, languages_str, '|'.join(broad_genres)])

                # Update tracking for filenames after processing all lines
                filenames_array.append(filenames)

            # Close last CSV file of current identifier if open
            if csvoutputfile:
                csvoutputfile.close()

        # After processing all parts, write filenames to a tracking file
        with open(os.path.join(OUTPUT_PATH, 'filenames_{}.txt'.format(identifier)), 'w') as f:
            for filename in filenames:
                f.write("%s\n" % filename)

    # Log the filenames for all processed files
    with open(os.path.join(OUTPUT_PATH, 'processed_files_log.txt'), 'w') as log_file:
        for filename_group in filenames_array:
            for filename in filename_group:
                log_file.write(f'{filename}\n')

if __name__ == "__main__":
    run()
