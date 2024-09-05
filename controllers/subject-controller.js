// controllers/subjectController.js
const Subject = require('../models/subjectSchema');
const Teacher = require('../models/teacherSchema');
const Student = require('../models/studentSchema');

const subjectCreate = async (req, res) => {
    try {
        const { subjects, adminID, sclassName } = req.body;
        const subjectCodes = subjects.map(subject => subject.subCode);

        // Check if any of the provided subject codes already exists
        const existingSubjects = await Subject.find({
            subCode: { $in: subjectCodes },
            school: adminID
        });

        if (existingSubjects.length > 0) {
            return res.status(400).json({ message: 'Some subject codes already exist.' });
        }

        const newSubjects = subjects.map(subject => ({
            ...subject,
            sclassName,
            school: adminID
        }));

        const result = await Subject.insertMany(newSubjects);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const allSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ school: req.params.id })
            .populate("sclassName", "sclassName");

        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found" });
        }

        res.json(subjects);
    } catch (err) {
        res.status(500).json(err);
    }
};

const classSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ sclassName: req.params.id });

        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found" });
        }

        res.json(subjects);
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeSubjectList = async (req, res) => {
    try {
        const subjects = await Subject.find({ sclassName: req.params.id, teacher: { $exists: false } });

        if (subjects.length === 0) {
            return res.status(404).json({ message: "No free subjects found" });
        }

        res.json(subjects);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getSubjectDetail = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate("sclassName", "sclassName")
            .populate("teacher", "name");

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.json(subject);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Unset teachSubject field in Teacher and remove subject references from Student collections
        await Teacher.updateOne(
            { teachSubject: subject._id },
            { $unset: { teachSubject: "" } }
        );

        await Student.updateMany(
            {},
            { $pull: { examResult: { subName: subject._id }, attendance: { subName: subject._id } } }
        );

        res.json(subject);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubjects = async (req, res) => {
    try {
        const subjects = await Subject.deleteMany({ school: req.params.id });

        if (subjects.deletedCount === 0) {
            return res.status(404).json({ message: "No subjects found to delete" });
        }

        await Teacher.updateMany(
            { teachSubject: { $in: subjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" } }
        );

        await Student.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.json(subjects);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjects = await Subject.deleteMany({ sclassName: req.params.id });

        if (subjects.deletedCount === 0) {
            return res.status(404).json({ message: "No subjects found for this class" });
        }

        await Teacher.updateMany(
            { teachSubject: { $in: subjects.map(subject => subject._id) } },
            { $unset: { teachSubject: "" } }
        );

        await Student.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.json(subjects);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    subjectCreate,
    allSubjects,
    classSubjects,
    freeSubjectList,
    getSubjectDetail,
    deleteSubject,
    deleteSubjects,
    deleteSubjectsByClass
};
