const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const path = require('path');

// Monkey patch face-api to work in a Node.js environment
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

const loadModels = async () => {
    if (modelsLoaded) return;
    
    const MODEL_URL = path.join(__dirname, '../ai-models');
    
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
    
    modelsLoaded = true;
    console.log('AI Face Models Loaded Successfully');
};

const getFaceDescriptor = async (imageUrl) => {
    await loadModels();
    
    try {
        const img = await canvas.loadImage(imageUrl);
        const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        
        if (!detection) {
            return null; // No face detected
        }
        
        // Convert the Float32Array to a standard JavaScript Array for MongoDB storage
        return Array.from(detection.descriptor);
    } catch (error) {
        console.error("Face detection error:", error);
        return null;
    }
};

module.exports = { getFaceDescriptor, loadModels };