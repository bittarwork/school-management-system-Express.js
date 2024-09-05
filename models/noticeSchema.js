const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    category: {
        type: String,
        enum: ['general', 'event', 'reminder'],
        default: 'general' // Default to 'general' if no category is provided
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active' // Active by default
    },
    visibility: {
        type: String,
        enum: ['all', 'teachers', 'students'],
        default: 'all' // Visible to everyone by default
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
        index: true // Index for better performance in queries
    },
}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema);
