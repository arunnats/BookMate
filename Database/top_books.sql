SHOW DATABASES;
USE bookmate;

CREATE TABLE top_books (
    ISBN VARCHAR(13) PRIMARY KEY,       
    `Book-Title` VARCHAR(255),
    `Book-Author` VARCHAR(255),
    `Image-URL-M` TEXT,
    `Year-Of-Publication` INT,
    `num_ratings` INT,                 
    `avg_rating` FLOAT
);


SELECT COUNT(*) FROM top_books;
CREATE INDEX titles ON top_books (`Book_Title`(255));
ALTER TABLE top_books ADD FULLTEXT INDEX title_index (`Book_Title`);

SELECT * FROM top_books WHERE `Book_Title` LIKE '%harry potter and the%' LIMIT 10;