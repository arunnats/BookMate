SHOW DATABASES;
USE bookmate;
CREATE INDEX titles ON book (Title(255));
ALTER TABLE book ADD FULLTEXT INDEX title_index (title);
SHOW INDEX FROM book WHERE Key_name = 'title_index';