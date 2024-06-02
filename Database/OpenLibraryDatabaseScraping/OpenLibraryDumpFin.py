import csv
import ctypes as ct
import os
import json
import difflib

csv.field_size_limit(int(ct.c_ulong(-1).value // 2))

LINES_PER_FILE = 2000000

INPUT_PATH = "/media/arunnats/Storage/in"
OUTPUT_PATH = "/media/arunnats/Storage/out"
FILE_IDENTIFIERS = ['editions_2024-04-30']


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

# Convert to sets for O(1) average-time complexity lookups
interested_subjects = set(map(str.lower, interested_subjects))
uninterested_subjects = set(map(str.lower, uninterested_subjects))


def run():
    """Run the script."""
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
                    writer.writerow(['Title', 'ISBN', 'Subjects', 'Author', 'Author_ID', 'Languages'])

                if len(row) > 4:
                    json_data = json.loads(row[4])
                    if 'title' in json_data and 'subjects' in json_data:
                        if not any(is_similar(subject, uninterested_subjects) for subject in json_data['subjects']):
                            if any(is_similar(subject, interested_subjects) for subject in json_data['subjects']):
                                title = json_data['title']
                                isbn = json_data['isbn_13'][0] if 'isbn_13' in json_data and len(json_data['isbn_13']) > 0 else ''
                                subjects = '|'.join(json_data['subjects']) if 'subjects' in json_data else ''
                                author = json_data.get('by_statement', '')
                                authorID = '|'.join(author['key'].split('/')[-1] for author in json_data.get('authors', []))
                                languages = '|'.join(language.get('key', '').split('/')[-1] for language in json_data.get('languages', []))
                                writer.writerow([title, isbn, subjects, author, authorID, languages])

            if csvoutputfile:
                csvoutputfile.close()

        filenames_array.append([identifier, str(file_id), False, filenames])
        print('\n', identifier, 'text file has now been processed.\n')
        print(identifier, str(file_id), filenames)
        file_id += 1

    filenamesoutput = open(os.path.join(OUTPUT_PATH, "filenames.txt"), "a", newline="", encoding="utf-8")
    filenameswriter = csv.writer(filenamesoutput, delimiter='\t', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for row in filenames_array:
        filenameswriter.writerow([row[0], row[1], row[2], '{' + ','.join(row[3]).strip("'") + '}'])

    filenamesoutput.close()
    print("Process complete")


run()
