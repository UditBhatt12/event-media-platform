const Media = require('../models/Media');
const Comment = require('../models/Comment');
const User = require('../models/User');

const toggleLike = async (req, res) => {
    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) return res.status(404).json({ message: 'Media not found' });

        const index = media.likes.indexOf(req.user._id);
        if (index === -1) {
            media.likes.push(req.user._id);
        } else {
            media.likes.splice(index, 1);
        }
        
        await media.save();
        res.status(200).json(media.likes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.create({
            media: req.params.mediaId,
            user: req.user._id,
            text
        });
        
        const populatedComment = await comment.populate('user', 'name');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ media: req.params.mediaId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleFavourite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const index = user.favourites.indexOf(req.params.mediaId);
        
        if (index === -1) {
            user.favourites.push(req.params.mediaId);
        } else {
            user.favourites.splice(index, 1);
        }
        
        await user.save();
        res.status(200).json(user.favourites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleLike, addComment, getComments, toggleFavourite };