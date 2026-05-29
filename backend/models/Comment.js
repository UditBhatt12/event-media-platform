const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    media: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Media'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;