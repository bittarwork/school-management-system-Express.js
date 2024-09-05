const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true // Title of the assignment
    },
    description: {
        type: String,
        required: true // Description of the assignment
    },
    dueDate: {
        type: Date,
        required: true // Due date for the assignment
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true // Subject to which the assignment belongs
    },
    sclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sclass',
        required: true // Class to which the assignment is assigned
    },
    attachments: [String], // URLs or paths to any attachments related to the assignment
    notifications: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        notifiedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Notified', 'Acknowledged', 'Completed'],
            default: 'Notified'
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
