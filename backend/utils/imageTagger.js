const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const canvas = require('canvas');

let model = null;

const loadTaggerModel = async () => {
    if (!model) {
        model = await mobilenet.load({ version: 2, alpha: 1.0 });
        console.log('AI Image Tagging Model Loaded Successfully');
    }
};

const generateTags = async (imageUrl) => {
    await loadTaggerModel();
    try {
        const img = await canvas.loadImage(imageUrl);
        const cvs = canvas.createCanvas(img.width, img.height);
        const ctx = cvs.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Convert canvas image to TensorFlow tensor
        const tensor = tf.browser.fromPixels(cvs);
        
        // Classify the image and get top 3 predictions
        const predictions = await model.classify(tensor);
        tensor.dispose(); // Free up memory
        
        // Extract just the primary word from each prediction
        return predictions.map(p => p.className.split(',')[0].toLowerCase().trim());
    } catch (error) {
        console.error('Error generating AI tags:', error);
        return [];
    }
};

module.exports = { generateTags, loadTaggerModel };