# 📸 EventLens AI: Smart Media Platform

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge\&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge\&logo=tensorflow\&logoColor=white)

An intelligent multi-tenant SaaS media platform designed to streamline event photo management. EventLens AI combines facial recognition, cloud-based media processing, and event-level role-based access control (RBAC) to create a seamless experience for organizers and attendees.

---

## 🚀 Live Demo

* **Frontend (Vercel):** https://event-media-platform-one.vercel.app
* **Backend API (Render):** https://event-media-api-tz29.onrender.com

---

## ✨ Key Features

### 🏢 Multi-Tenant Architecture & Event Security

* Every event acts as an independent, secure workspace.
* Event creators are automatically assigned the **Owner** role.
* Event-level RBAC allows users to have different permissions across different events.
* Private events include a **Request to Join** workflow with owner approval.

### 🤖 AI-Powered Media Discovery

* **Facial Recognition Search:** Upload a selfie and instantly find all photos containing your face.
* Uses **face-api.js** with TensorFlow-backed neural networks to generate facial embeddings.
* **Automatic Image Tagging:** Cloudinary AI generates contextual tags for uploaded images, enabling fast keyword-based search.

### 💬 Social Community Features

* Responsive lightbox for viewing high-resolution images.
* Like and comment system for community engagement.
* Automated notifications for likes and comments.

### ☁️ Cloud Media Management

* Secure image storage using Cloudinary.
* Optimized image delivery and processing.
* Efficient multipart uploads with Multer.

---

## 🛠️ Technology Stack

### Frontend

* Next.js (App Router)
* React 18
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Tokens (JWT)
* Multer

### AI & Cloud Infrastructure

* Cloudinary V2 API
* face-api.js
* TensorFlow.js
* Node Canvas

---

## 📂 Project Structure

```text
event-media-platform/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── ...
│
└── README.md
```

---

## 💻 Local Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/UditBhatt12/event-media-platform.git
cd event-media-platform
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the frontend server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🔐 Authentication & Authorization

* JWT-based authentication.
* Protected API routes.
* Event-level role management.
* Private event approval workflow.

---

## 🧠 AI Workflow

1. User uploads images.
2. Images are stored in Cloudinary.
3. Facial embeddings are generated using face-api.js.
4. Cloudinary AI generates image tags.
5. Users can search by:

   * Selfie upload
   * Keywords
   * Event participation

---


## 👨‍💻 Author

**Udit Bhatt**


* GitHub: https://github.com/UditBhatt12
