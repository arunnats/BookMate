SHOW DATABASES;
USE bookmate;

CREATE TABLE admin (
    username VARCHAR(255) PRIMARY KEY,
    enc_password VARCHAR(255) NOT NULL
);

SELECT * FROM admin LIMIT 10;