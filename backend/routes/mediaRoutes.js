const express = require('express');
const { uploadMedia, getEventMedia, toggleLike, addComment } = require('../controllers/mediaController');
// 👇 FIXED: Imported authorizeRoles
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// 👇 FIXED: Added the Bouncer. Only Admins and Photographers can upload!
router.post('/upload', protect, authorizeRoles('Admin', 'Photographer'), upload.array('files', 10), uploadMedia);

router.get('/event/:eventId', getEventMedia);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;