const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next(); 
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};



const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // 👇 HARDCODED ADMIN BYPASS: If this is your email, the bouncer always says YES.
        if (req.user && req.user.email === 'uditbhatt1205@gmail.com') {
            return next(); 
        }
        
        // Standard check for everyone else
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access Denied: Your role (${req.user ? req.user.role : 'Guest'}) is not authorized.`
            });
        }
        
        next();
    };
};

const Event = require('../models/Event'); // Make sure to import the Event model at the top!

// 👇 NEW: The Local Event Bouncer
const authorizeEventAccess = async (req, res, next) => {
    try {
        // The eventId will come from either the URL parameters or the request body
        const eventId = req.params.eventId || req.body.eventId;
        
        if (!eventId) {
            return res.status(400).json({ message: "Event ID is required to check permissions." });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // If the event is PUBLIC, let anyone who is logged in upload (optional, adjust to your liking)
        if (!event.isPrivate) {
            return next();
        }

        // If the event is PRIVATE, check the VIP list!
        const userId = req.user._id.toString();
        const isOwner = event.owner.toString() === userId;
        const isApprovedMember = event.approvedMembers.some(memberId => memberId.toString() === userId);

        if (isOwner || isApprovedMember) {
            return next(); // They are on the list, let them through!
        } else {
            return res.status(403).json({ 
                message: "Access Denied: You are not an approved member of this private event." 
            });
        }
    } catch (error) {
        console.error("Event Auth Error:", error);
        res.status(500).json({ message: "Server error while verifying event permissions." });
    }
};

// Don't forget to export it!
module.exports = { protect, authorizeRoles, authorizeEventAccess };