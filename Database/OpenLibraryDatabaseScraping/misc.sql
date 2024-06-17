SHOW DATABASES;
USE bookmate;

DESC Book;

DROP TABLE Book;

CREATE TABLE Book(Title VARCHAR(255), ISBN VARCHAR(20), Genres TEXT );

LOAD DATA INFILE 'C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\editions_18000000.csv'
        INTO TABLE book
        FIELDS TERMINATED BY '\t'
        LINES TERMINATED BY '\n'
        IGNORE 1 LINES
        (Title, ISBN, Genres);
        
SELECT * FROM book LIMIT 10;

CREATE INDEX titles ON book (Title(255));

SELECT COUNT(*) FROM book;

ALTER TABLE book ADD FULLTEXT INDEX title_index (title);

SELECT * FROM book WHERE MATCH(title) AGAINST ('Percy jackson and the olym');

SELECT Title, ISBN, Genres
FROM book
WHERE MATCH(Title) AGAINST('prisoner of azkaban' IN NATURAL LANGUAGE MODE)
LIMIT 15;

SHOW INDEX FROM book WHERE Key_name = 'title_index';


SHOW VARIABLES LIKE 'wait_timeout';
SHOW VARIABLES LIKE 'interactive_timeout';
SHOW VARIABLES LIKE 'max_allowed_packet ';

CREATE TABLE top_books (
    ISBN VARCHAR(13) PRIMARY KEY,
    Book_Title VARCHAR(255),
    Book_Author VARCHAR(255),
    Image_URL_M VARCHAR(255),
    num_ratings INT,
    avg_rating FLOAT
);

CREATE TABLE temp_top_books (
    ISBN VARCHAR(13) PRIMARY KEY,
    Book_Title VARCHAR(255),
    Book_Author VARCHAR(255),
    Image_URL_M VARCHAR(255),
    num_ratings INT,
    avg_rating FLOAT
);


desc top_books;

DROP TABLE top_books;

SELECT * FROM top_books LIMIT 10;

SELECT COUNT(*) FROM top_books;
SELECT COUNT(*) FROM temp_top_books;

SHOW COLUMNS FROM top_books;

CREATE INDEX titles ON top_books (`Book-Title`(255));
ALTER TABLE top_books ADD FULLTEXT INDEX title_index (`Book-Title`);

SELECT * FROM top_books WHERE `Book-Title` LIKE '%harry potter and the%' LIMIT 10;

CREATE INDEX titles ON temp_top_books (`Book-Title`(255));
ALTER TABLE temp_top_books ADD FULLTEXT INDEX title_index (`Book-Title`);
SELECT * FROM temp_top_books WHERE `Book-Title` LIKE '%harry potter and the%' LIMIT 10;

SET GLOBAL  wait_timeout = 288000;
SET GLOBAL  interactive_timeout = 288000;


CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, 
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users LIMIT 10;
