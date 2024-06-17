SHOW DATABASES;
USE bookmate;

CREATE TABLE Book(Title VARCHAR(255), ISBN VARCHAR(20), Genres TEXT );

CREATE INDEX titles ON book (Title(255));
ALTER TABLE book ADD FULLTEXT INDEX title_index (title);

SELECT COUNT(*) FROM book;
SELECT * FROM book WHERE MATCH(title) AGAINST ('Percy jackson and the olym');