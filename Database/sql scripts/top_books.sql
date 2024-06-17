SHOW DATABASES;
USE bookmate;

CREATE TABLE top_books (
    ISBN VARCHAR(13) PRIMARY KEY,
    Book_Title VARCHAR(255),
    Book_Author VARCHAR(255),
    Image_URL_M VARCHAR(255),
    num_ratings INT,
    avg_rating FLOAT
);

SELECT COUNT(*) FROM top_books;
CREATE INDEX titles ON top_books (`Book-Title`(255));
ALTER TABLE top_books ADD FULLTEXT INDEX title_index (`Book-Title`);

SELECT * FROM top_books WHERE `Book-Title` LIKE '%harry potter and the%' LIMIT 10;