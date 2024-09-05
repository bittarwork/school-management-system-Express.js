const Complain = require('../models/complainSchema.js');

// Function to create a new complaint
const complainCreate = async (req, res) => {
    try {
        // Validate the request body
        const { user, date, complaint, school, priority, status } = req.body;

        if (!user || !complaint || !school) {
            return res.status(400).send({ message: "Missing required fields: user, complaint, and school" });
        }

        // Check for duplicate complaint by the same user for the same school
        const existingComplain = await Complain.findOne({ user, school, complaint });
        if (existingComplain) {
            return res.status(409).send({ message: "Complaint already exists for this user in this school" });
        }

        // Create a new complaint
        const newComplain = new Complain({
            user,
            date: date || Date.now(),
            complaint,
            school,
            priority: priority || 'medium', // Default to medium if not provided
            status: status || 'open' // Default to open if not provided
        });

        const result = await newComplain.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Function to list all complaints with optional filtering by status
const complainList = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query; // Optionally filter by status

        // Find complaints by school with optional status filtering
        let query = { school: id };
        if (status) {
            query.status = status; // If status is provided, filter by it
        }

        const complains = await Complain.find(query)
            .populate("user", "name")
            .sort({ date: -1 }); // Sort by date descending

        if (complains.length > 0) {
            res.send(complains);
        } else {
            res.status(404).send({ message: "No complaints found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Function to update the status of a complaint (e.g., to close it)
const updateComplainStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['open', 'in_progress', 'closed'].includes(status)) {
            return res.status(400).send({ message: "Invalid status. Valid statuses are: open, in_progress, closed" });
        }

        // Find the complaint by ID and update its status
        const updatedComplain = await Complain.findByIdAndUpdate(
            id,
            {
                status: status,
                resolvedDate: status === 'closed' ? Date.now() : null // Set resolvedDate if closed
            },
            { new: true }
        );

        if (updatedComplain) {
            res.send(updatedComplain);
        } else {
            res.status(404).send({ message: "Complaint not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Function to delete a complaint
const deleteComplain = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedComplain = await Complain.findByIdAndDelete(id);
        if (!deletedComplain) {
            return res.status(404).send({ message: "Complaint not found" });
        }

        res.send({ message: "Complaint deleted successfully", deletedComplain });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    complainCreate,
    complainList,
    updateComplainStatus,
    deleteComplain,
};
