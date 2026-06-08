const express = require('express');
const { uploadMedia, getEventMedia, toggleLike } = require('../controllers/mediaController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/upload', protect, upload.array('files', 10), uploadMedia);
router.get('/event/:eventId', getEventMedia);

// 👇 NEW: The secure route to toggle a like
router.post('/:id/like', protect, toggleLike); 

module.exports = router;