const Event = require('../models/Event');

const createEvent = async (req, res) => {
    try {
        const { name, description, category, eventDate, isPrivate } = req.body;

        const event = await Event.create({
            name,
            description,
            category,
            eventDate,
            isPrivate,
            organizer: req.user._id
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        // Fetch all events and populate the organizer's name and email
        const events = await Event.find({}).populate('organizer', 'name email').sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createEvent, getEvents };