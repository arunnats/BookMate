SHOW DATABASES;
USE bookmate;

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,          
    LibID VARCHAR(25),                   
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    picture_url TEXT,
    created_at DATETIME,
    phone_num VARCHAR(20),
    instagram VARCHAR(255),
    nickname VARCHAR(255),
    opted_in BOOLEAN DEFAULT FALSE,
    profile_done BOOLEAN DEFAULT FALSE,
    BookmateID VARCHAR(255),             
    instagram_public BOOLEAN,
    phone_public BOOLEAN,
    email_public BOOLEAN
);


SELECT * FROM users LIMIT 10;