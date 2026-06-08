# 📸 EventLens AI: Smart Media Platform

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)

An intelligent, full-stack event media platform designed to streamline photo management. EventLens AI goes beyond standard galleries by integrating custom neural networks for facial recognition, role-based access control, and dynamic cloud media processing.

---

## 🚀 Live Demo
* **Frontend (Vercel):** [https://event-media-platform-one.vercel.app](https://event-media-platform-one.vercel.app)
* **Backend API (Render):** [https://event-media-api-tz29.onrender.com](https://event-media-api-tz29.onrender.com)

---

## ✨ Enterprise-Grade Features

### 🤖 AI-Powered Discovery
* **Facial Recognition Search Engine:** Uses `@vladmandic/face-api` to extract 128-dimensional geometric face maps. Users can upload a selfie to instantly query the database and retrieve every event photo they appear in.
* **Smart Image Tagging:** Direct Cloudinary AI integration automatically analyzes uploaded photos and generates contextual tags (e.g., "crowd", "laptop", "outdoor") for lightning-fast keyword searching.

### 🔒 Security & Access Control
* **Role-Based Access Control (RBAC):** Custom JWT middleware securely enforces four distinct user tiers: `Admin`, `Photographer`, `Club Member`, and `Viewer`.
* **Private Event Hubs:** Organizers can flag events as "Private," restricting gallery access strictly to authorized Club Members and Admins.
* **Dynamic Watermarking:** Protects digital assets by dynamically injecting on-the-fly "EventLens AI" watermarks directly via Cloudinary URL transformation during image downloads.

### 💬 Social Community Suite
* **Interactive Lightbox:** A beautiful, responsive modal UI for viewing high-resolution media.
* **Real-Time Engagement:** Users can like, comment, and engage with community photos.
* **Smart Notifications:** The backend automatically generates and dispatches notifications when users receive likes or comments on their uploaded media.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
* Next.js (App Router)
* React 18
* Tailwind CSS
* Axios (API Client)

**Backend Architecture:**
* Node.js & Express.js
* MongoDB Atlas & Mongoose (ODM)
* JSON Web Tokens (JWT) for secure, stateless Auth
* Multer (Multipart/form-data handling)

**AI & Cloud Infrastructure:**
* Cloudinary V2 API (Storage & Dynamic Processing)
* `face-api.js` (TensorFlow-backed Neural Networks)
* Node Canvas (Virtual image processing)

---

## 💻 Local Setup & Installation

Want to run EventLens AI on your local machine? Follow these steps:

### 1. Clone the Repository 

git clone [https://github.com/UditBhatt12/event-media-platform.git](https://github.com/UditBhatt12/event-media-platform.git)
cd event-media-platform

### 2. Backend Setup
cd backend
npm install


#### Create a .env file in the backend directory and add your credentials:
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

#### Start the Backend Server
npm run dev

### 3. Frontend Setup
cd frontend
npm install

#### Create a .env.local file in the frontend directory:
NEXT_PUBLIC_API_URL=http://localhost:5001/api

#### Start the Next.js development server:
npm run dev

👨‍💻 Author
Built by Udit Bhatt