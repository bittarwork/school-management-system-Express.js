const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true // Ensures that each classroom has a unique room number
    },
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sclass',
        required: true // Links to a specific class
    },
    capacity: {
        type: Number,
        required: true // Maximum number of students that can be accommodated
    },
    resources: [String], // List of resources available in the classroom
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Classroom", classroomSchema);
