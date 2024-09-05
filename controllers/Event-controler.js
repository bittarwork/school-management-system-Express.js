const Event = require('../models/eventSchema'); // Import Event model

// Create a new event
const createEvent = async (req, res) => {
    try {
        // Create a new Event document using the request body data
        const event = new Event(req.body);

        // Save the new Event document to the database
        const result = await event.save();

        // Respond with the newly created Event document
        res.status(201).send(result);
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while creating the event", details: err });
    }
};

// List all events for a specific school
const listEvents = async (req, res) => {
    try {
        // Find all events related to a specific school
        const events = await Event.find({ school: req.params.schoolId });

        // Check if any events were found
        if (events.length > 0) {
            res.status(200).send(events);
        } else {
            res.status(404).send({ message: "No events found for this school" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving events", details: err });
    }
};

// Get details of a specific event
const getEventDetails = async (req, res) => {
    try {
        // Find a specific Event by its ID
        const event = await Event.findById(req.params.id);

        // Check if the Event was found
        if (event) {
            res.status(200).send(event);
        } else {
            res.status(404).send({ message: "Event not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while retrieving event details", details: err });
    }
};

// Update details of a specific event
const updateEvent = async (req, res) => {
    try {
        // Find the Event by ID and update it with the provided data
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Check if the Event was updated successfully
        if (event) {
            res.status(200).send(event);
        } else {
            res.status(404).send({ message: "Event not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while updating the event", details: err });
    }
};

// Delete a specific event
const deleteEvent = async (req, res) => {
    try {
        // Find and delete the Event by ID
        const event = await Event.findByIdAndDelete(req.params.id);

        // Check if the Event was deleted successfully
        if (event) {
            res.status(200).send({ message: "Event deleted successfully" });
        } else {
            res.status(404).send({ message: "Event not found" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting the event", details: err });
    }
};

// Delete all events for a specific school
const deleteEventsBySchool = async (req, res) => {
    try {
        // Find and delete all Events by school ID
        const result = await Event.deleteMany({ school: req.params.schoolId });

        // Check if any Events were deleted
        if (result.deletedCount > 0) {
            res.status(200).send({ message: "All events for the school deleted successfully" });
        } else {
            res.status(404).send({ message: "No events found for the specified school" });
        }
    } catch (err) {
        // Respond with an error status and message if there is an issue
        res.status(500).json({ error: "An error occurred while deleting events", details: err });
    }
};

module.exports = {
    createEvent,
    listEvents,
    getEventDetails,
    updateEvent,
    deleteEvent,
    deleteEventsBySchool
};
