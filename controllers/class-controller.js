const Sclass = require('../models/sclassSchema');
const Student = require('../models/studentSchema');

// Create a new class
const sclassCreate = async (req, res) => {
    try {
        const { sclassName, school, description, gradeLevel } = req.body;

        // Check for existing class with the same name within the same school
        const existingSclass = await Sclass.findOne({ sclassName, school });
        if (existingSclass) {
            return res.status(400).send({ message: 'Class name already exists in this school' });
        }

        const newSclass = new Sclass({
            sclassName,
            school,
            description,
            gradeLevel
        });

        const result = await newSclass.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while creating the class', details: err });
    }
};

// List all classes for a specific school
const sclassList = async (req, res) => {
    try {
        const schoolId = req.params.id;

        // Find all classes associated with the provided school ID
        const sclasses = await Sclass.find({ school: schoolId });

        if (sclasses.length > 0) {
            res.send(sclasses);
        } else {
            res.send({ message: 'No classes found for this school' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving classes', details: err });
    }
};

// Get details of a specific class
const getSclassDetail = async (req, res) => {
    try {
        const sclassId = req.params.id;

        // Find the class by ID and populate school reference if needed
        let sclass = await Sclass.findById(sclassId).populate('school', 'name');
        if (sclass) {
            res.send(sclass);
        } else {
            res.send({ message: 'Class not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving class details', details: err });
    }
};

// Get students enrolled in a specific class
const getSclassStudents = async (req, res) => {
    try {
        const sclassId = req.params.id;

        // Find students associated with the class ID
        let students = await Student.find({ sclassName: sclassId });
        if (students.length > 0) {
            // Optionally remove sensitive fields
            students = students.map(student => {
                return { ...student._doc, password: undefined };
            });
            res.send(students);
        } else {
            res.send({ message: 'No students found in this class' });
        }
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving students', details: err });
    }
};

// Delete a specific class and associated data
const deleteSclass = async (req, res) => {
    try {
        const sclassId = req.params.id;

        // Find and delete the class
        const deletedClass = await Sclass.findByIdAndDelete(sclassId);
        if (!deletedClass) {
            return res.status(404).send({ message: 'Class not found' });
        }

        // Optionally delete associated students, subjects, etc.
        // Example: await Student.deleteMany({ sclassName: sclassId });

        res.send(deletedClass);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the class', details: err });
    }
};

// Delete all classes for a specific school
const deleteSclasses = async (req, res) => {
    try {
        const schoolId = req.params.id;

        // Find and delete all classes associated with the provided school ID
        const deletedClasses = await Sclass.deleteMany({ school: schoolId });
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).send({ message: 'No classes found for this school' });
        }

        // Optionally delete associated students, subjects, etc.
        // Example: await Student.deleteMany({ school: schoolId });

        res.send(deletedClasses);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting classes', details: err });
    }
};

// Additional function: Get all classes with pagination
const getSclassesWithPagination = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const { page = 1, limit = 10 } = req.query;

        // Find classes with pagination
        const sclasses = await Sclass.find({ school: schoolId })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.send(sclasses);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while retrieving paginated classes', details: err });
    }
};

// Additional function: Update class details
const updateSclass = async (req, res) => {
    try {
        const sclassId = req.params.id;
        const updates = req.body;

        // Find and update the class
        const updatedSclass = await Sclass.findByIdAndUpdate(sclassId, updates, { new: true });
        if (!updatedSclass) {
            return res.status(404).send({ message: 'Class not found' });
        }

        res.send(updatedSclass);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the class', details: err });
    }
};

module.exports = { sclassCreate, sclassList, getSclassDetail, getSclassStudents, deleteSclass, deleteSclasses, getSclassesWithPagination, updateSclass };
