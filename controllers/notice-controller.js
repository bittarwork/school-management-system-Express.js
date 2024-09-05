const Notice = require('../models/noticeSchema.js');

// Create a new notice
const noticeCreate = async (req, res) => {
    try {
        const { title, details, date, adminID } = req.body;

        // Validate required fields
        if (!title || !details || !date || !adminID) {
            return res.status(400).send({ message: "All fields are required" });
        }

        // Create a new notice object
        const notice = new Notice({
            title,
            details,
            date,
            school: adminID
        });

        // Save the notice to the database
        const result = await notice.save();
        res.status(201).send(result);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Retrieve a list of all notices for a specific school
const noticeList = async (req, res) => {
    try {
        const { id: schoolID } = req.params;

        // Find notices by the school ID
        const notices = await Notice.find({ school: schoolID }).sort({ date: -1 }); // Sort by latest date

        // If no notices are found
        if (!notices.length) {
            return res.status(404).send({ message: "No notices found" });
        }

        // Return the found notices
        res.send(notices);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Get the details of a single notice
const getNoticeDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Find notice by its ID
        const notice = await Notice.findById(id);

        // If notice is not found
        if (!notice) {
            return res.status(404).send({ message: "Notice not found" });
        }

        // Return the notice details
        res.send(notice);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Update an existing notice
const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, details, date } = req.body;

        // Find the notice by ID and update the fields
        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { title, details, date },
            { new: true, runValidators: true } // Return updated object and validate fields
        );

        // If the notice is not found
        if (!updatedNotice) {
            return res.status(404).send({ message: "Notice not found" });
        }

        // Return the updated notice
        res.send(updatedNotice);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Delete a notice
const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the notice by its ID
        const deletedNotice = await Notice.findByIdAndDelete(id);

        // If notice is not found
        if (!deletedNotice) {
            return res.status(404).send({ message: "Notice not found" });
        }

        // Return success message
        res.send({ message: "Notice deleted successfully", deletedNotice });
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Get the latest notice
const getLatestNotice = async (req, res) => {
    try {
        // Find the latest notice based on the date
        const latestNotice = await Notice.findOne({ school: req.params.id })
            .sort({ date: -1 }); // Sort by date in descending order

        // If no notice is found
        if (!latestNotice) {
            return res.status(404).send({ message: "No notices found" });
        }

        // Return the latest notice
        res.send(latestNotice);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

// Get notices between two dates (for filtering by date range)
const getNoticesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Ensure both dates are provided
        if (!startDate || !endDate) {
            return res.status(400).send({ message: "Start date and end date are required" });
        }

        // Find notices within the specified date range
        const notices = await Notice.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
            school: req.params.id
        });

        // If no notices are found in the range
        if (!notices.length) {
            return res.status(404).send({ message: "No notices found in this date range" });
        }

        // Return the filtered notices
        res.send(notices);
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err });
    }
};

module.exports = {
    noticeCreate,
    noticeList,
    getNoticeDetail,
    updateNotice,
    deleteNotice,
    getLatestNotice,
    getNoticesByDateRange
};
