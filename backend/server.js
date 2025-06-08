require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const travelRoutes = require('./routes/travel');
const chatRoutes = require('./routes/chat');
const communityRoutes = require('./routes/community');
const jobsRoutes = require('./routes/jobs');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const storiesRoutes = require('./routes/stories');
const messagesRoutes = require('./routes/messages');

const connectDB = require('./config/db');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5179', // Change to your frontend URL in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', travelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/messages', messagesRoutes);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve frontend for any unknown route (for React Router direct links)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../project/dist/index.html'));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Change to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', (data) => {
    // Optionally save message to DB here
    io.to(data.roomId).emit('message', data); // Broadcast to room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 