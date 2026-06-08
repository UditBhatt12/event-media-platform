const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-media',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    // This tells Cloudinary to run Google Vision AI on the photo!
    categorization: 'google_tagging',
    auto_tagging: 0.6 // Only add tags if the AI is 60%+ confident
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };