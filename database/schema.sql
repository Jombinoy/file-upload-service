CREATE DATABASE IF NOT EXISTS fileupload;
USE fileupload;

CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    mimeType VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
