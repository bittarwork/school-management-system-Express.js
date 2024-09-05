const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');

// Admin Registration
const adminRegister = async (req, res) => {
    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Create a new admin instance with hashed password
        const admin = new Admin({
            ...req.body,
            password: hashedPass  // Save the hashed password
        });

        // Check for existing admin by email or school name
        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        } else if (existingSchool) {
            return res.status(400).send({ message: 'School name already exists' });
        } else {
            const result = await admin.save();
            result.password = undefined;  // Don't return the password in the response
            return res.status(201).send(result);
        }
    } catch (err) {
        return res.status(500).json({ error: "An error occurred during registration", details: err });
    }
};

// Admin Login
const adminLogIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        // Find the admin by email
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(404).send({ message: "User not found" });
        }

        // Compare provided password with the hashed password stored
        const validated = await bcrypt.compare(req.body.password, admin.password);
        if (!validated) {
            return res.status(400).send({ message: "Invalid password" });
        }

        admin.password = undefined;  // Don't return the password in the response
        return res.status(200).send(admin);
    } catch (err) {
        return res.status(500).json({ error: "An error occurred during login", details: err });
    }
};

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const admin = new Admin({
            ...req.body,
            password: hashedPass
        });

        const result = await admin.save();
        result.password = undefined;  // Don't return the password in the response
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error creating admin", error: err.message });
    }
};

// List all admins
const listAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        if (admins.length > 0) {
            res.status(200).json(admins);
        } else {
            res.status(404).json({ message: "No admins found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving admins", error: err.message });
    }
};

// Get details of a specific admin
const getAdminDetail = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;  // Don't return the password in the response
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error retrieving admin", error: err.message });
    }
};

// Update an existing admin's details
const updateAdmin = async (req, res) => {
    try {
        if (req.body.password) {
            // Hash the new password before updating
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (admin) {
            admin.password = undefined;  // Don't return the password in the response
            res.status(200).json(admin);
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating admin", error: err.message });
    }
};

// Delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (admin) {
            res.status(200).json({ message: "Admin deleted", deletedAdmin: admin });
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error deleting admin", error: err.message });
    }
};

module.exports = { createAdmin, listAdmins, getAdminDetail, updateAdmin, deleteAdmin, adminRegister, adminLogIn };
