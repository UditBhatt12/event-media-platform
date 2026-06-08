const Media = require('../models/Media');
const Event = require('../models/Event');
const cloudinary = require('cloudinary').v2; 
const Notification = require('../models/Notification');
const canvas = require('canvas'); 
const { faceapi } = require('../config/faceApi'); 

const uploadMedia = async (req, res) => {
    try {
        const { eventId } = req.body;
        
        if (!eventId) {
            return res.status(400).json({ message: 'Event ID is required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const mediaDataPromises = req.files.map(async (file) => {
            const cloudData = await cloudinary.api.resource(file.filename);
            const generatedTags = cloudData.tags || []; 

            let descriptors = [];
            try {
                const img = await canvas.loadImage(file.path);
                const detections = await faceapi
                    .detectAllFaces(img)
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                
                descriptors = detections.map(d => Array.from(d.descriptor));
                console.log(`[AI Sync] Scanned ${descriptors.length} face(s) in photo: ${file.filename}`);
            } catch (faceError) {
                console.error(`[AI Error] Failed face tracking on file ${file.filename}:`, faceError);
            }

            return {
                event: eventId,
                uploadedBy: req.user._id,
                imageUrl: file.path,
                cloudinaryId: file.filename,
                isPrivate: req.body.isPrivate || false,
                aiTags: generatedTags, 
                faceDescriptors: descriptors 
            };
        });

        const mediaData = await Promise.all(mediaDataPromises);
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

const toggleLike = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id); 
    if (!media) return res.status(404).json({ message: "Media not found" });

    const isLiked = media.likes.includes(req.user._id);

    if (isLiked) {
      media.likes = media.likes.filter(userId => userId.toString() !== req.user._id.toString());
    } else {
      media.likes.push(req.user._id);
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
    res.status(500).json({ message: "Server error while toggling like" });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    const newComment = { user: req.user._id, text: text };
    media.comments.push(newComment);
    await media.save();

    if (media.user && media.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: media.user,       
        sender: req.user._id,        
        type: 'comment',
        mediaId: media._id,
        message: `commented: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"` 
      });
    }

    res.status(200).json({ comments: media.comments });
  } catch (error) {
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

const searchByFace = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file received by backend!" });

        console.log("Analyzing selfie:", file.path);
        const img = await canvas.loadImage(file.path);
        
        const selfieDetection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
        if (!selfieDetection) {
            return res.status(400).json({ message: "AI could not detect a clear face in this selfie. Try another!" });
        }

        const allMedia = await Media.find({});
        
        const matches = allMedia.filter(photo => {
            if (!photo.faceDescriptors || !Array.isArray(photo.faceDescriptors) || photo.faceDescriptors.length === 0) {
                return false;
            }
            return photo.faceDescriptors.some(desc => {
                const distance = faceapi.euclideanDistance(selfieDetection.descriptor, desc);
                return distance < 0.6; 
            });
        });

        console.log(`Found ${matches.length} matching photos!`);
        res.status(200).json(matches);
        
    } catch (error) {
        console.error("AI SEARCH CRASH:", error); 
        res.status(500).json({ message: "Internal server error during face search." });
    }
};

module.exports = { uploadMedia, getEventMedia, toggleLike, addComment, searchByFace };