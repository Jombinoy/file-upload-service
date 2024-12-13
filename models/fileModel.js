const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    // Uploader information can be added here if authentication is implemented
    // uploader: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

module.exports = mongoose.model('File', fileSchema);
