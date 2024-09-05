const Parent = require('../models/ParentSchema'); // Import Parent model
const Student = require('../models/studentSchema'); // Import Student model

// Create a new parent
const createParent = async (req, res) => {
    try {
        // Create a new Parent document using the request body data
        const parent = new Parent(req.body);

        // Save the new Parent document to the database
        const result = await parent.save();

        // Respond with the newly created Parent document
        res.status(201).send(result);
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while creating the parent", details: err });
    }
};

// List all parents for a specific school
const listParents = async (req, res) => {
    try {
        // Find all parents related to a specific school
        const parents = await Parent.find({ school: req.params.schoolId })
            .populate('students', 'name'); // Populate Student information for each Parent

        // Check if any parents were found
        if (parents.length > 0) {
            res.status(200).send(parents);
        } else {
            res.status(404).send({ message: "No parents found for this school" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving parents", details: err });
    }
};

// Get details of a specific parent
const getParentDetails = async (req, res) => {
    try {
        // Find a specific Parent by its ID
        const parent = await Parent.findById(req.params.id)
            .populate('students', 'name'); // Populate Student information

        // Check if the Parent was found
        if (parent) {
            res.status(200).send(parent);
        } else {
            res.status(404).send({ message: "Parent not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving parent details", details: err });
    }
};

// Update details of a specific parent
const updateParent = async (req, res) => {
    try {
        // Find the Parent by ID and update it with the provided data
        const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if the Parent was updated successfully
        if (parent) {
            res.status(200).send(parent);
        } else {
            res.status(404).send({ message: "Parent not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while updating the parent", details: err });
    }
};

// Delete a specific parent
const deleteParent = async (req, res) => {
    try {
        // Find and delete the Parent by ID
        const parent = await Parent.findByIdAndDelete(req.params.id);

        // Check if the Parent was deleted successfully
        if (parent) {
            // Optionally, you might want to also handle related data
            // For example, remove parent references from students
            await Student.updateMany(
                { parent: req.params.id },
                { $unset: { parent: "" } }
            );

            res.status(200).send({ message: "Parent deleted successfully" });
        } else {
            res.status(404).send({ message: "Parent not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting the parent", details: err });
    }
};

// Delete all parents for a specific school
const deleteParentsBySchool = async (req, res) => {
    try {
        // Find and delete all Parents by school ID
        const result = await Parent.deleteMany({ school: req.params.schoolId });

        // Check if any Parents were deleted
        if (result.deletedCount > 0) {
            // Optionally, handle related data removal
            await Student.updateMany(
                { school: req.params.schoolId },
                { $unset: { parent: "" } }
            );

            res.status(200).send({ message: "All parents for the school deleted successfully" });
        } else {
            res.status(404).send({ message: "No parents found for the specified school" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting parents", details: err });
    }
};

module.exports = {
    createParent,
    listParents,
    getParentDetails,
    updateParent,
    deleteParent,
    deleteParentsBySchool
};
