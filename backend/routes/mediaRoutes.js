const express = require('express');

const { protect, authorizeRoles, authorizeEventAccess } = require('../middlewares/authMiddleware');

const { 
    uploadMedia, 
    getEventMedia, 
    toggleLike, 
    addComment, 
    searchByFace 
} = require('../controllers/mediaController');

const { upload } = require('../config/cloudinary');

const router = express.Router();

// AI Face Search Route 
router.post('/search-face', protect, upload.single('file'), searchByFace);

// 👇 FIXED: Multer (upload.array) now runs BEFORE the bouncer (authorizeEventAccess)
router.post('/upload', protect, upload.array('files', 10), authorizeEventAccess, uploadMedia);

// Event Gallery Route
router.get('/event/:eventId', getEventMedia);

// Social Routes
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;