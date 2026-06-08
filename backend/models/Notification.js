const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // The person who owns the photo
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // The person who clicked 'like'
  type: { 
    type: String, 
    enum: ['like', 'comment', 'tag'], 
    required: true 
  },
  mediaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Media' 
  }, // The specific photo
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);