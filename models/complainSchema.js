const mongoose = require('mongoose');

// Define valid statuses for complaints
const validStatuses = ['open', 'in_progress', 'closed'];

const complainSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true,
        index: true // Indexing for faster queries
    },
    date: {
        type: Date,
        default: Date.now, // Default to current date if not provided
        required: true
    },
    complaint: {
        type: String,
        required: true,
        minlength: 10, // Ensure the complaint is at least 10 characters long
        maxlength: 1000 // Limit to 1000 characters
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
        index: true // Indexing for faster queries
    },
    status: {
        type: String,
        enum: validStatuses, // Restrict status to valid values
        default: 'open' // Default status is 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'], // Optional priority field
        default: 'medium'
    },
    resolvedDate: {
        type: Date, // Optional field to store when the complaint was resolved
    }
}, { timestamps: true });

// Add compound index to speed up common queries by school and status
complainSchema.index({ school: 1, status: 1 });

module.exports = mongoose.model("Complain", complainSchema);
