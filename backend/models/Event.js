const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date, required: true }, // 👈 FIXED: Matches frontend
    location: { type: String },                // 👈 FIXED: Added location
    isPrivate: { type: Boolean, default: false },
    
    // Event-Level Security Fields
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    approvedMembers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    pendingRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);