const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// 👇 FIXED: Added the Bouncer. Only Admins and Club Members can create events!
router.post('/', protect, authorizeRoles('Admin', 'Club Member'), createEvent);

// 👇 FIXED: Added 'protect' so only logged-in users can fetch the event list
router.get('/', protect, getEvents);

module.exports = router;