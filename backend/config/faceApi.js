const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const path = require('path');

// 1. Monkey-patch Node.js so face-api can read images just like a web browser does
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// 2. Function to load the neural networks into memory
const loadModels = async () => {
  try {
    // 👇 FIXED: Only going up one level to the backend's node_modules folder!
    const modelPath = path.resolve(__dirname, '../node_modules/@vladmandic/face-api/model');
    
    console.log('Loading Face API models... (This might take a few seconds)');
    
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);     // Detects faces
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);  // Finds eyes, nose, mouth
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath); // Creates the mathematical map
    
    console.log('🤖 AI Facial Recognition Engines Online!');
  } catch (error) {
    console.error('CRITICAL: Failed to load Face API models:', error);
  }
};

module.exports = { faceapi, loadModels };