# AI-Powered Event Media Platform

A full-stack, cloud-native application designed to streamline event media management. This platform allows users to upload, organize, and interact with event photos using built-in AI facial recognition and smart image tagging.

## 🚀 Live Links
- **Frontend (Vercel):** https://event-media-platform-one.vercel.app
- **Backend API (Render):** https://event-media-api-tz29.onrender.com

## ✨ Key Features
- **AI Facial Recognition:** Automatically extracts face maps using `@vladmandic/face-api` to help users find photos of themselves.
- **Smart Image Tagging:** Uses TensorFlow.js MobileNet to automatically categorize uploaded media (e.g., "mountain", "crowd").
- **Real-Time Notifications:** Integrated Socket.io pushes instant live alerts when users receive likes, comments, or are tagged in photos.
- **Cloud Media Storage:** Direct integration with Cloudinary for secure, fast, and optimized image hosting.
- **Social Interactions:** Users can like, comment, and favourite media.
- **Secure Authentication:** JWT-based user authentication and role management.

## 🛠️ Technology Stack
- **Frontend:** Next.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB Atlas, Mongoose
- **AI / Machine Learning:** TensorFlow.js (`@tensorflow/tfjs-node`, `@tensorflow-models/mobilenet`), `face-api.js`
- **Cloud Storage:** Cloudinary
- **Deployment:** Vercel (Frontend), Render (Backend API)

## 💻 Local Setup Instructions

### Prerequisites
- Node.js installed on your machine
- A MongoDB Atlas cluster
- A Cloudinary account

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/event-media-platform.git](https://github.com/yourusername/event-media-platform.git)