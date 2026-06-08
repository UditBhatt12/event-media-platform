require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const socialRoutes = require('./routes/socialRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { loadModels } = require('./config/faceApi');
// Connect to database
connectDB();
loadModels();

// Initialize the app FIRST
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: '*', // We will restrict this to the Vercel domain during deployment
        methods: ['GET', 'POST']
    }
});

// Make io accessible inside our controllers
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Users will join a private room using their User ID to receive personal notifications
    socket.on('join_personal_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined personal notification room`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/social', socialRoutes);
// 👇 FIXED: This is now safely below the app initialization!
app.use('/api/notifications', notificationRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Event & Media API is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});