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


def is_similar(subject, targestList, threshold=0.7):
    for interested_subject in targestList:
        # First check for simple substring match to quickly filter out unlikely candidates
        if interested_subject.lower() in subject.lower() or subject.lower() in interested_subject.lower():
            return True
        # Then check for more complex similarity
        similarity = difflib.SequenceMatcher(None, subject.lower(), interested_subject.lower()).ratio()
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

                    filename = identifier + \
                        '_{}.csv'.format(line + LINES_PER_FILE)

                    filenames.append(filename)
                    csvoutput = open(os.path.join(
                        OUTPUT_PATH, filename), "w", newline="", encoding="utf-8")
                    writer = csv.writer(
                        csvoutput, delimiter='\t', quotechar='|', quoting=csv.QUOTE_MINIMAL)
                    writer.writerow(['Title', 'ISBN', 'Subjects'])

                if len(row) > 4:
                    json_data = json.loads(row[4])

                    if 'title' in json_data and 'subjects' in json_data:
                        # Check if any of the required subjects are present
                        if 'languages' in json_data and any(language.get('key', '').endswith('/eng') for language in json_data['languages']):
                            if not any(is_similar(subject, uninterested_subjects) for subject in json_data['subjects']):
                                if any(is_similar(subject, interested_subjects) for subject in json_data['subjects']):
                                    title = json_data['title']
                                    if 'isbn_13' in json_data and len(json_data['isbn_13']) > 0:
                                        isbn = json_data['isbn_13'][0]  
                                    else:
                                        isbn =''
                                    subjects = '|'.join(json_data['subjects']) if 'subjects' in json_data else ''

                                    writer.writerow([title, isbn, subjects])   

            if csvoutputfile:
                csvoutputfile.close()

        filenames_array.append([identifier, str(file_id), False, filenames])

        print('\n', identifier, 'text file has now been processed.\n')
        print(identifier, str(file_id), filenames)
        file_id += 1

    # list of filenames that can be loaded into database for automatic file reading.
    filenamesoutput = open(os.path.join(
        OUTPUT_PATH, "filenames.txt"), "a", newline="", encoding="utf-8")
    filenameswriter = csv.writer(
        filenamesoutput, delimiter='\t', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for row in filenames_array:

        filenameswriter.writerow(
            [row[0], row[1], row[2], '{' + ','.join(row[3]).strip("'") + '}'])

    filenamesoutput.close()

    print("Process complete")


run()
