const express = require('express');
const { getMyNotifications } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route: GET /api/notifications
router.get('/', protect, getMyNotifications);

module.exports = router;