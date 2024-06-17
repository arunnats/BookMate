SHOW DATABASES;
USE bookmate;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, 
    LibID VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    picture_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users LIMIT 10;