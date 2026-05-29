const express = require('express');
const { uploadMedia, getEventMedia } = require('../controllers/mediaController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Allow bulk uploads of up to 10 files at once
router.post('/upload', protect, upload.array('files', 10), uploadMedia);
router.get('/event/:eventId', getEventMedia);

module.exports = router;