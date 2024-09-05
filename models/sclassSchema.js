const mongoose = require("mongoose");

// Schema definition for Sclass model
const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
        unique: true,  // Ensure class names are unique within the school
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',  // Ensure proper reference to Admin model
        required: true,  // Ensure that the school field is always specified
    },
    description: {
        type: String,  // Optional field to describe the class
    },
    gradeLevel: {
        type: String,  // Optional field to specify the grade level
    }
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

// Create an index on school field to speed up queries
sclassSchema.index({ school: 1 });

// Exporting the Sclass model
module.exports = mongoose.model("Sclass", sclassSchema);
