SHOW DATABASES;
USE bookmate;

CREATE TABLE library (
    LibID VARCHAR(20) PRIMARY KEY,
    id VARCHAR(255),
    Fave_Books TEXT,
    Wishlist TEXT,
    answers VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id)
);

SELECT * FROM library LIMIT 10;