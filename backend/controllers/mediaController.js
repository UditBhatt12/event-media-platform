const Media = require('../models/Media');
const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2; // 👈 Added this to talk to Cloudinary directly!

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

module.exports = { uploadMedia, getEventMedia };