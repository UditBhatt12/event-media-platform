const express = require('express');

const { uploadMedia, getEventMedia, toggleLike, addComment } = require('../controllers/mediaController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/upload', protect, upload.array('files', 10), uploadMedia);
router.get('/event/:eventId', getEventMedia);
router.post('/:id/like', protect, toggleLike);

// 👇 NEW: The route to post a comment
router.post('/:id/comment', protect, addComment);

module.exports = router;