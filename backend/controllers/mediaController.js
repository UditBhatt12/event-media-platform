const Media = require('../models/Media');
const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2; // 👈 Added this to talk to Cloudinary directly!
const Notification = require('../models/Notification');
const uploadMedia = async (req, res) => {
    try {
        const { eventId } = req.body;
        
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Process all uploaded files concurrently
        const mediaDataPromises = req.files.map(async (file) => {
            
            // 🚨 NEW: Ask Cloudinary for the AI metadata it just generated!
            const cloudData = await cloudinary.api.resource(file.filename);
            const generatedTags = cloudData.tags || []; 

            return {
                event: eventId,
                uploadedBy: req.user._id,
                imageUrl: file.path,
                cloudinaryId: file.filename,
                isPrivate: req.body.isPrivate || false,
                aiTags: generatedTags, // 👈 THE MAGIC HAPPENS HERE!
                faceDescriptor: []    
            };
        });

        const mediaData = await Promise.all(mediaDataPromises);

        // Bulk insert into MongoDB
        const savedMedia = await Media.insertMany(mediaData);
        res.status(201).json(savedMedia);
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getEventMedia = async (req, res) => {
    try {
        const media = await Media.find({ event: req.params.eventId })
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle Like on a photo
const toggleLike = async (req, res) => {
  try {
    // 👇 FIXED: Removed .populate('user') so Mongoose stops crashing!
    const media = await Media.findById(req.params.id); 
    
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const isLiked = media.likes.includes(req.user._id);

    if (isLiked) {
      // UNLIKE: Remove user ID
      media.likes = media.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      // LIKE: Add user ID
      media.likes.push(req.user._id);

      // Only notify if the person liking the photo is NOT the owner
      if (media.user && media.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: media.user,       
          sender: req.user._id,        
          type: 'like',
          mediaId: media._id,
          message: `Someone liked your photo!` 
        });
      }
    }

    await media.save();
    res.status(200).json({ likes: media.likes });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error while toggling like" });
  }
};

// Add a comment to a photo
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // 1. Create the comment object
    const newComment = {
      user: req.user._id,
      text: text
    };

    // 2. Add it to the photo's array and save
    media.comments.push(newComment);
    await media.save();

    // 3. Send a notification to the owner!
    if (media.user && media.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: media.user,       
        sender: req.user._id,        
        type: 'comment',
        mediaId: media._id,
        // Keep it brief for the dropdown UI
        message: `commented: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"` 
      });
    }

    // Send back the updated comments array
    res.status(200).json({ comments: media.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

module.exports = { uploadMedia, getEventMedia ,toggleLike,addComment};