const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const [result] = await db.execute(
            'INSERT INTO files (filename, originalName, size, mimeType, path) VALUES (?, ?, ?, ?, ?)',
            [req.file.filename, req.file.originalname, req.file.size, req.file.mimetype, req.file.path]
        );

        const [fileData] = await db.execute('SELECT * FROM files WHERE id = ?', [result.insertId]);
        
        res.status(201).json({
            message: 'File uploaded successfully',
            file: fileData[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download endpoint
router.get('/download/:id', async (req, res) => {
    try {
        const [files] = await db.execute('SELECT * FROM files WHERE id = ?', [req.params.id]);
        
        if (!files.length) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[0];
        const filePath = path.join(__dirname, '..', file.path);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.setHeader('Content-Type', file.mimeType);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete endpoint
router.delete('/delete/:id', async (req, res) => {
    try {
        const [files] = await db.execute('SELECT * FROM files WHERE id = ?', [req.params.id]);
        
        if (!files.length) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[0];
        const filePath = path.join(__dirname, '..', file.path);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.execute('DELETE FROM files WHERE id = ?', [req.params.id]);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all files endpoint
router.get('/files', async (req, res) => {
    try {
        const [files] = await db.execute('SELECT * FROM files ORDER BY uploadedAt DESC');
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
