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

module.exports = { protect, authorizeRoles };