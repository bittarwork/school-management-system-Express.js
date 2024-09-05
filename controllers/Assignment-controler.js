const Assignment = require('../models/assignmentSchema'); // Import Assignment model

// Create a new assignment
const createAssignment = async (req, res) => {
    try {
        // Create a new Assignment document using the request body data
        const assignment = new Assignment(req.body);

        // Save the new Assignment document to the database
        const result = await assignment.save();

        // Respond with the newly created Assignment document
        res.status(201).send(result);
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while creating the assignment", details: err });
    }
};

// List all assignments for a specific class
const listAssignments = async (req, res) => {
    try {
        // Find all assignments related to a specific class
        const assignments = await Assignment.find({ sclassName: req.params.classId });

        // Check if any assignments were found
        if (assignments.length > 0) {
            res.status(200).send(assignments);
        } else {
            res.status(404).send({ message: "No assignments found for this class" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving assignments", details: err });
    }
};

// Get details of a specific assignment
const getAssignmentDetails = async (req, res) => {
    try {
        // Find a specific Assignment by its ID
        const assignment = await Assignment.findById(req.params.id);

        // Check if the Assignment was found
        if (assignment) {
            res.status(200).send(assignment);
        } else {
            res.status(404).send({ message: "Assignment not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving assignment details", details: err });
    }
};

// Update details of a specific assignment
const updateAssignment = async (req, res) => {
    try {
        // Find the Assignment by ID and update it with the provided data
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if the Assignment was updated successfully
        if (assignment) {
            res.status(200).send(assignment);
        } else {
            res.status(404).send({ message: "Assignment not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while updating the assignment", details: err });
    }
};

// Delete a specific assignment
const deleteAssignment = async (req, res) => {
    try {
        // Find and delete the Assignment by ID
        const assignment = await Assignment.findByIdAndDelete(req.params.id);

        // Check if the Assignment was deleted successfully
        if (assignment) {
            res.status(200).send({ message: "Assignment deleted successfully" });
        } else {
            res.status(404).send({ message: "Assignment not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting the assignment", details: err });
    }
};

// Delete all assignments for a specific class
const deleteAssignmentsByClass = async (req, res) => {
    try {
        // Find and delete all Assignments by class ID
        const result = await Assignment.deleteMany({ sclassName: req.params.classId });

        // Check if any Assignments were deleted
        if (result.deletedCount > 0) {
            res.status(200).send({ message: "All assignments for the class deleted successfully" });
        } else {
            res.status(404).send({ message: "No assignments found for the specified class" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting assignments", details: err });
    }
};

// Delete all assignments for a specific school
const deleteAssignmentsBySchool = async (req, res) => {
    try {
        // Find and delete all Assignments by school ID
        const result = await Assignment.deleteMany({ school: req.params.schoolId });

        // Check if any Assignments were deleted
        if (result.deletedCount > 0) {
            res.status(200).send({ message: "All assignments for the school deleted successfully" });
        } else {
            res.status(404).send({ message: "No assignments found for the specified school" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting assignments", details: err });
    }
};

module.exports = {
    createAssignment,
    listAssignments,
    getAssignmentDetails,
    updateAssignment,
    deleteAssignment,
    deleteAssignmentsByClass,
    deleteAssignmentsBySchool
};
