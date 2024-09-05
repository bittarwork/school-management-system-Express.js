const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');

// Helper function to remove sensitive data
const sanitizeStudentData = (student) => {
    student.password = undefined;
    student.examResult = undefined;
    student.attendance = undefined;
    return student;
};

// Register Student
const studentRegister = async (req, res) => {
    try {
        const { rollNum, adminID, sclassName, password } = req.body;

        const existingStudent = await Student.findOne({ rollNum, school: adminID, sclassName });
        if (existingStudent) {
            return res.status(400).json({ message: 'Roll Number already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const student = new Student({ ...req.body, school: adminID, password: hashedPass });
        const result = await student.save();

        return res.status(201).json(sanitizeStudentData(result));
    } catch (err) {
        return res.status(500).json({ message: "Failed to register student", error: err });
    }
};

// Student Login
const studentLogIn = async (req, res) => {
    try {
        const student = await Student.findOne({ rollNum: req.body.rollNum, name: req.body.studentName }).populate('school', 'schoolName').populate('sclassName', 'sclassName');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const validated = await bcrypt.compare(req.body.password, student.password);
        if (!validated) {
            return res.status(400).json({ message: "Invalid password" });
        }

        return res.status(200).json(sanitizeStudentData(student));
    } catch (err) {
        return res.status(500).json({ message: "Login failed", error: err });
    }
};

// Get All Students by School ID
const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName").lean();
        if (students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        return res.status(200).json(students.map(sanitizeStudentData));
    } catch (err) {
        return res.status(500).json({ message: "Failed to retrieve students", error: err });
    }
};

// Get Student by ID
const getStudentDetail = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName")
            .populate("examResult.subName", "subName")
            .populate("attendance.subName", "subName sessions")
            .lean();

        if (!student) {
            return res.status(404).json({ message: "No student found" });
        }

        return res.status(200).json(sanitizeStudentData(student));
    } catch (err) {
        return res.status(500).json({ message: "Failed to retrieve student details", error: err });
    }
};

// Update Student Details
const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const result = await Student.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
        if (!result) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json(sanitizeStudentData(result));
    } catch (err) {
        return res.status(500).json({ message: "Failed to update student", error: err });
    }
};

// Update Exam Result
const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const existingResult = student.examResult.find(result => result.subName.toString() === subName);
        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update exam results", error });
    }
};

// Mark Attendance
const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const existingAttendance = student.attendance.find(
            (a) => a.date.toDateString() === new Date(date).toDateString() && a.subName.toString() === subName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            student.attendance.push({ date, status, subName });
        }

        const result = await student.save();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update attendance", error });
    }
};

// Delete Student by ID
const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete student", error: err });
    }
};

// Delete Students by Class
const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No students found to delete" });
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete students", error: err });
    }
};

// Clear All Attendance for All Students in School
const clearAllStudentsAttendance = async (req, res) => {
    try {
        const result = await Student.updateMany({ school: req.params.id }, { $set: { attendance: [] } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Failed to clear attendance", error });
    }
};

// Remove Specific Attendance for a Student
const removeStudentAttendanceBySubject = async (req, res) => {
    const { subId } = req.body;
    try {
        const result = await Student.updateOne(
            { _id: req.params.id },
            { $pull: { attendance: { subName: subId } } }
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Failed to remove attendance", error });
    }
};

// Export Controllers
module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
};
