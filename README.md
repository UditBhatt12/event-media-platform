# 📸 EventLens AI: Smart Media Platform

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)

An intelligent full-stack event media platform designed to streamline photo management. EventLens AI goes beyond standard galleries by integrating facial recognition, role-based access control, cloud media processing, and AI-powered image discovery.

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://event-media-platform-one.vercel.app
- **Backend API (Render):** https://event-media-api-tz29.onrender.com

---

## ✨ Features

### 🤖 AI-Powered Discovery

- **Facial Recognition Search Engine:** Uses `@vladmandic/face-api` to extract 128-dimensional face embeddings. Users can upload a selfie to instantly find event photos containing their face.
- **Smart Image Tagging:** Cloudinary AI automatically analyzes uploaded images and generates contextual tags such as `crowd`, `outdoor`, and `laptop` for efficient searching.

### 🔒 Security & Access Control

- **Role-Based Access Control (RBAC):** Secure JWT-based authentication with four user roles:
  - Admin
  - Photographer
  - Club Member
  - Viewer
- **Private Event Hubs:** Organizers can create private events accessible only to authorized members.
- **Dynamic Watermarking:** Images are protected through Cloudinary URL transformations that apply watermarks during downloads.

### 💬 Social Community Features

- **Interactive Lightbox:** Responsive image viewer for high-resolution media.
- **Likes & Comments:** Users can engage with event photos through likes and comments.
- **Smart Notifications:** Automatic notifications are generated when users receive likes or comments on their uploaded media.

---

## 🛠️ Tech Stack

### Frontend

- Next.js (App Router)
- React 18
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- Multer

### AI & Cloud Services

- Cloudinary API
- `@vladmandic/face-api`
- TensorFlow.js
- Node Canvas

---

## 💻 Local Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/UditBhatt12/event-media-platform.git
cd event-media-platform
```

### 2. Backend Setup

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

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the frontend development server:

```bash
npm run dev
```

---

## 📂 Project Structure

```text
event-media-platform/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── lib/
│
└── README.md
```

---



## 👨‍💻 Author

**Udit Bhatt**

GitHub: https://github.com/UditBhatt12

---

