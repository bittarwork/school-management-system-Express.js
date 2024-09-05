const Classroom = require('../models/ClassroomSchema'); // Import Classroom model
const Sclass = require('../models/sclassSchema'); // Import Sclass model
const Subject = require('../models/subjectSchema'); // Import Subject model

// Create a new classroom
const createClassroom = async (req, res) => {
    try {
        // Create a new Classroom document using the request body data
        const classroom = new Classroom(req.body);

        // Save the new Classroom document to the database
        const result = await classroom.save();

        // Respond with the newly created Classroom document
        res.status(201).send(result);
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while creating the classroom", details: err });
    }
};

// List all classrooms for a specific class
const listClassrooms = async (req, res) => {
    try {
        // Find all classrooms related to a specific Sclass
        const classrooms = await Classroom.find({ sclass: req.params.sclassId })
            .populate('sclass', 'sclassName'); // Populate Sclass information for each Classroom

        // Check if any classrooms were found
        if (classrooms.length > 0) {
            res.status(200).send(classrooms);
        } else {
            res.status(404).send({ message: "No classrooms found for this class" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving classrooms", details: err });
    }
};

// Get details of a specific classroom
const getClassroomDetails = async (req, res) => {
    try {
        // Find a specific Classroom by its ID
        const classroom = await Classroom.findById(req.params.id)
            .populate('sclass', 'sclassName') // Populate Sclass information
            .populate('schedule.subject', 'subName'); // Populate Subject information in the schedule

        // Check if the Classroom was found
        if (classroom) {
            res.status(200).send(classroom);
        } else {
            res.status(404).send({ message: "Classroom not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving classroom details", details: err });
    }
};

// Update details of a specific classroom
const updateClassroom = async (req, res) => {
    try {
        // Find the Classroom by ID and update it with the provided data
        const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if the Classroom was updated successfully
        if (classroom) {
            res.status(200).send(classroom);
        } else {
            res.status(404).send({ message: "Classroom not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while updating the classroom", details: err });
    }
};

// Delete a specific classroom
const deleteClassroom = async (req, res) => {
    try {
        // Find and delete the Classroom by ID
        const classroom = await Classroom.findByIdAndDelete(req.params.id);

        // Check if the Classroom was deleted successfully
        if (classroom) {
            res.status(200).send({ message: "Classroom deleted successfully" });
        } else {
            res.status(404).send({ message: "Classroom not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting the classroom", details: err });
    }
};

// Delete all classrooms associated with a specific class
const deleteClassroomsBySclass = async (req, res) => {
    try {
        // Delete all Classrooms related to a specific Sclass
        const result = await Classroom.deleteMany({ sclass: req.params.sclassId });

        // Check if any Classrooms were deleted
        if (result.deletedCount > 0) {
            res.status(200).send({ message: "All classrooms for the class deleted successfully" });
        } else {
            res.status(404).send({ message: "No classrooms found for the specified class" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting classrooms", details: err });
    }
};

module.exports = {
    createClassroom,
    listClassrooms,
    getClassroomDetails,
    updateClassroom,
    deleteClassroom,
    deleteClassroomsBySclass
};
