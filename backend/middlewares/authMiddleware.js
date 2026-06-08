const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// 👇 NEW: The Bouncer Middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // If the user's role is NOT in the list of allowed roles, kick them out
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access Denied: Your role (${req.user ? req.user.role : 'Guest'}) is not authorized.`
            });
        }
        // If they have the right role, let them through!
        next();
    };
};

module.exports = { protect, authorizeRoles };