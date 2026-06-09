const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

// 👇 FIXED: Added getAllEvents to the imports
const { createEvent, requestJoin, approveMember, getEventById, getAllEvents } = require('../controllers/eventController');

const router = express.Router();

// 👇 NEW: Get ALL events for the dashboard
router.get('/', protect, getAllEvents);

// Create a new event
router.post('/create', protect, createEvent);

// Get specific Event Details & User Status
router.get('/:id', protect, getEventById);

// Request to join a private event
router.post('/:id/request', protect, requestJoin);

// Approve a user's request (Owner only)
router.post('/:id/approve', protect, approveMember);

module.exports = router;