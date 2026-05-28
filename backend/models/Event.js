const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;