const Media = require('../models/Media');
const Event = require('../models/Event');
const { generateTags } = require('../utils/imageTagger');
const { getFaceDescriptor } = require('../utils/faceRecognition');

const uploadMedia = async (req, res) => {
    try {
        const { eventId } = req.body;
        
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Process all uploaded files concurrently through the AI models
        const mediaDataPromises = req.files.map(async (file) => {
            const aiTags = await generateTags(file.path);
            const faceDescriptor = await getFaceDescriptor(file.path);

            return {
                event: eventId,
                uploadedBy: req.user._id,
                imageUrl: file.path,
                cloudinaryId: file.filename,
                isPrivate: req.body.isPrivate || false,
                aiTags: aiTags || [],
                faceDescriptor: faceDescriptor || []
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