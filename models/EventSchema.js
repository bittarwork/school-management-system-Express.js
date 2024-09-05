const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Title of the event
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true // Date of the event
    },
    location: {
        type: String // Location where the event will take place
    },
    participants: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher' // Organizer of the event
    }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
