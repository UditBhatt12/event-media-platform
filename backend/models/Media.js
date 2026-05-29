const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    aiTags: [{ 
        type: String 
    }],
    userTags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;