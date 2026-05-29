const express = require('express');
const { toggleLike, addComment, getComments, toggleFavourite } = require('../controllers/socialController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:mediaId/like', protect, toggleLike);
router.post('/:mediaId/comment', protect, addComment);
router.get('/:mediaId/comment', getComments);
router.post('/:mediaId/favourite', protect, toggleFavourite);

module.exports = router;