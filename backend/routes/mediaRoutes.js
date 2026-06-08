const express = require('express');

// 👇 FIXED: Added searchByFace to the imports
const { 
    uploadMedia, 
    getEventMedia, 
    toggleLike, 
    addComment, 
    searchByFace 
} = require('../controllers/mediaController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// AI Face Search Route (Placed at the top to avoid route conflicts)
router.post('/search-face', protect, upload.single('file'), searchByFace);

// Upload Route (Admins & Photographers only)
router.post('/upload', protect, authorizeRoles('Admin', 'Photographer'), upload.array('files', 10), uploadMedia);

// Event Gallery Route
router.get('/event/:eventId', getEventMedia);

// Social Routes
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);

module.exports = router;