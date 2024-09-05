const mongoose = require("mongoose");

// Schema definition for Admin model
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Name is required
        trim: true  // Remove any extra spaces from the name
    },
    email: {
        type: String,
        unique: true,  // Email must be unique
        required: true,  // Email is required
        lowercase: true,  // Convert email to lowercase
        trim: true,  // Remove any extra spaces from the email
        validate: {
            validator: function (v) {
                // Regular expression to validate email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,  // Password is required
        minlength: 6  // Minimum password length
    },
    role: {
        type: String,
        default: "Admin",  // Default role is Admin
        enum: ["Admin", "SuperAdmin", "Manager"]  // Roles allowed
    },
    schoolName: {
        type: String,
        unique: true,  // Each school must have a unique name
        required: true,  // School name is required
        trim: true  // Remove any extra spaces from the school name
    }
}, { timestamps: true });  // Add timestamps to track creation and modification times

// Exporting the Admin model
module.exports = mongoose.model("Admin", adminSchema);
