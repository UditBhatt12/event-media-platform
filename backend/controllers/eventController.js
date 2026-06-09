const Event = require('../models/Event');


// 👇 NEW: Fetch all events for the dashboard
const getAllEvents = async (req, res) => {
    try {
        // Fetch all events, sorted by newest first
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events." });
    }
};

// 1. Create an Event
const createEvent = async (req, res) => {
    try {
        // 👇 FIXED: Pull eventDate and location from the request
        const { name, description, eventDate, location, isPrivate } = req.body;
        
        const newEvent = await Event.create({
            name,
            description,
            eventDate,  // 👈 Use eventDate
            location,   // 👈 Save the location
            isPrivate: isPrivate || false,
            owner: req.user._id,             
            approvedMembers: [req.user._id]  
        });
        
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        // I also added the error.message here so if it fails again, the frontend tells us EXACTLY why!
        res.status(500).json({ message: "Failed to create event.", error: error.message });
    }
};

// 2. Request to Join an Event
const requestJoin = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found." });
        if (!event.isPrivate) return res.status(400).json({ message: "This event is public, no need to request." });

        // Prevent spam requests
        if (event.approvedMembers.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already a member." });
        }
        if (event.pendingRequests.includes(req.user._id)) {
            return res.status(400).json({ message: "Your request is already pending." });
        }

        // Add them to the waiting room
        event.pendingRequests.push(req.user._id);
        await event.save();
        
        res.status(200).json({ message: "Request to join sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Approve a Member (Only the Owner can do this!)
const approveMember = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { userId } = req.body; // The ID of the user standing in line

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found." });

        // 🚨 SECURITY CHECK: Is the person making this request actually the owner?
        if (event.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the event owner can approve members." });
        }

        // Check if user is actually in the waiting room
        if (!event.pendingRequests.includes(userId)) {
            return res.status(400).json({ message: "User is not in the pending requests list." });
        }

        // Move them from pending -> approved
        event.pendingRequests = event.pendingRequests.filter(id => id.toString() !== userId);
        event.approvedMembers.push(userId);
        
        await event.save();
        res.status(200).json({ message: "Member approved and added to the VIP list!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 👇 NEW: Get Event Details & User Status
const getEventById = async (req, res) => {
    try {
        // Populate pulls the actual names and emails of the people waiting in line!
        const event = await Event.findById(req.params.id).populate('pendingRequests', 'name email');
        if (!event) return res.status(404).json({ message: "Event not found." });

        const userId = req.user._id.toString();
        
        // Calculate the user's access level
        const isOwner = event.owner.toString() === userId;
        const isApproved = event.approvedMembers.some(id => id.toString() === userId);
        const isPending = event.pendingRequests.some(user => user._id.toString() === userId);

        // Send back the event data PLUS their security clearance
        res.status(200).json({
            ...event._doc,
            isOwner,
            isApproved,
            isPending
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update your exports to include it!
module.exports = { createEvent, requestJoin, approveMember, getEventById, getAllEvents };