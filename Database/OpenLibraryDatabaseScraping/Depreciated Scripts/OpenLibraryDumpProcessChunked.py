import csv
import ctypes as ct
import os
import json

csv.field_size_limit(int(ct.c_ulong(-1).value // 2))

LINES_PER_FILE = 2000000

INPUT_PATH = "/media/arunnats/Storage/in"
OUTPUT_PATH = "/media/arunnats/Storage/out"
FILE_IDENTIFIERS = ['editions_2024-04-30']


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
                        interested_subjects = {'fiction', 'romance', 'young adult', 'fantasy', 'American drama', 'FICTION / Thrillers / General', 'Fiction, thrillers, suspense', 'FICTION / Thrillers / Suspense', 'Suspense', 'Thrillers', 'Action and adventure fiction', 'Romans, nouvelles', 'Fantasy fiction', 'Fiction, fantasy, general', 'Young adult fiction', 'Teenage girls', 'Juvenile fiction', 'History', 'Romance', 'literary fiction', 'FICTION / Romance / Contemporary', 'Fiction, erotica, general', 'Love stories', 'Erotic Fiction', 'Imaginary places', 'action & adventure', 'Epic', 'Epic literature', 'Juvenile Fantasy fiction', 'Fantasy', 'Adventure', 'fiction mystery & detective traditional', 'crime novel', 'crime', 'novel', 'Hindu mythology', 'Fiction, romance, general', 'romance', 'dark fantasy', 'Young adult fiction', 'post-apocalyptic', 'gothic', 'horror', 'Horror fiction', 'Horror tales', 'Science fiction', 'Homosexuality', 'Coming of age', 'Good and evil', 'Time travel', 'Reading Level-Grade 9', 'Reading Level-Grade 8', 'Reading Level-Grade 11', 'Reading Level-Grade 10', 'Reading Level-Grade 12', 'alternative history', 'Romantic Comedy', 'comics', 'Comic books, strips', 'Friendship', 'Mystery'}
                        if any(subject.lower() in map(str.lower, interested_subjects) or any(interested_subj.lower() in subject.lower() for interested_subj in interested_subjects) for subject in json_data['subjects']):
                            if 'languages' in json_data and any(language.get('key', '').endswith('/eng') for language in json_data['languages']):
                                title = json_data['title']
                                isbn = json_data['isbn_13'][0] if 'isbn_13' in json_data else ''
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
