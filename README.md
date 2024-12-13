# File Upload Service

A simple file upload service built with Express.js and MongoDB that allows users to upload, download, and manage files.

## Features

- File upload with size and type restrictions
- File metadata storage in MongoDB
- File download functionality
- File deletion capability
- Secure file handling

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/fileupload
   MAX_FILE_SIZE=5242880
   ```
4. Start MongoDB service
5. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

### Upload File
- POST `/api/upload`
- Accepts multipart form data with a file field named 'file'
- Supports JPEG, PNG, and PDF files up to 5MB

### Download File
- GET `/api/download/:id`
- Downloads a file using its MongoDB ID

### Delete File
- DELETE `/api/delete/:id`
- Deletes a file and its metadata using its MongoDB ID

### List Files
- GET `/api/files`
- Returns a list of all uploaded files and their metadata

## File Restrictions

- Maximum file size: 5MB
- Allowed file types: JPEG, PNG, PDF
