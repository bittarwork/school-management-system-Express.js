const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

// Teacher Registration
const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass } = req.body;
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({
            name,
            email,
            password: hashedPass,
            role,
            school,
            teachSubject,
            teachSclass
        });

        // Check if teacher with this email already exists
        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            return res.status(400).send({ message: 'Email already exists' });
        } else {
            // Save the new teacher and link the subject
            let result = await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });

            // Hide password in response
            result.password = undefined;
            return res.status(201).send(result);
        }
    } catch (err) {
        return res.status(500).json({ error: 'Error registering teacher', details: err });
    }
};

// Teacher Login
const teacherLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure both email and password are provided
        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required" });
        }

        // Find the teacher by email
        let teacher = await Teacher.findOne({ email });

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        // Validate the password
        const validated = await bcrypt.compare(password, teacher.password);

        if (!validated) {
            return res.status(400).send({ message: "Invalid password" });
        }

        // Populate subject, school, and class details
        teacher = await teacher.populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName");

        teacher.password = undefined; // Hide password in response
        return res.status(200).send(teacher);
    } catch (err) {
        return res.status(500).json({ error: 'Error logging in', details: err });
    }
};

// Get All Teachers for a Specific School
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ school: req.params.id })
            .populate("teachSubject", "subName")
            .populate("teachSclass", "sclassName");

        if (teachers.length === 0) {
            return res.status(404).send({ message: "No teachers found" });
        }

        // Remove passwords from teacher objects
        const modifiedTeachers = teachers.map(teacher => ({ ...teacher._doc, password: undefined }));

        return res.status(200).send(modifiedTeachers);
    } catch (err) {
        return res.status(500).json({ error: 'Error retrieving teachers', details: err });
    }
};

// Get Teacher Details by ID
const getTeacherDetail = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName");

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        teacher.password = undefined; // Hide password in response
        return res.status(200).send(teacher);
    } catch (err) {
        return res.status(500).json({ error: 'Error retrieving teacher details', details: err });
    }
};

// Update Teacher's Subject
const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        // Update teacher's subject and also update the subject model
        const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, { teachSubject }, { new: true });
        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        return res.status(200).send(updatedTeacher);
    } catch (err) {
        return res.status(500).json({ error: 'Error updating teacher subject', details: err });
    }
};

// Delete a Teacher by ID
const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!deletedTeacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        // Unlink the teacher from the subject
        await Subject.updateOne({ teacher: deletedTeacher._id }, { $unset: { teacher: 1 } });

        return res.status(200).send(deletedTeacher);
    } catch (err) {
        return res.status(500).json({ error: 'Error deleting teacher', details: err });
    }
};

// Delete All Teachers from a Specific School
const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).send({ message: "No teachers found to delete" });
        }

        // Unlink the deleted teachers from their subjects
        await Subject.updateMany({ teacher: { $in: deletionResult.map(teacher => teacher._id) } }, { $unset: { teacher: 1 } });

        return res.status(200).send(deletionResult);
    } catch (err) {
        return res.status(500).json({ error: 'Error deleting teachers', details: err });
    }
};

// Update Teacher Attendance
const teacherAttendance = async (req, res) => {
    const { date, presentCount, absentCount } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        // Check if attendance already exists for the date
        const existingAttendance = teacher.attendance.find(
            (a) => a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            // Update the existing attendance record
            existingAttendance.presentCount = presentCount;
            existingAttendance.absentCount = absentCount;
        } else {
            // Add new attendance record
            teacher.attendance.push({ date, presentCount, absentCount });
        }

        const result = await teacher.save();
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).json({ error: 'Error updating attendance', details: err });
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    teacherAttendance
};
