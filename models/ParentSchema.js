const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Parent's name
    },
    email: {
        type: String,
        unique: true,
        required: true // Unique email for contact
    },
    phone: {
        type: String // Contact phone number
    },
    address: {
        type: String // Home address
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // References to the students the parent is associated with
    }],
    notifications: [{
        message: {
            type: String,
            required: true // Message content
        },
        date: {
            type: Date,
            default: Date.now // Date when the notification was sent
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Parent", parentSchema);
