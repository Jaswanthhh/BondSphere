const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Store online users
const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Add user to online users
    onlineUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: socket.user
    });

    // Broadcast user's online status
    socket.broadcast.emit('user:online', {
      userId: socket.user._id,
      name: socket.user.name
    });

    // Handle private messages
    socket.on('message:send', async (data) => {
      try {
        const { recipientId, content } = data;
        const message = new Message({
          sender: socket.user._id,
          recipient: recipientId,
          content
        });

        await message.save();

        // Create notification
        await Notification.create({
          recipient: recipientId,
          type: 'message',
          sender: socket.user._id,
          content: `New message from ${socket.user.name}`,
          data: { messageId: message._id },
          priority: 'normal',
          channels: ['in_app']
        });

        // Send message to recipient if online
        const recipientSocket = onlineUsers.get(recipientId);
        if (recipientSocket) {
          io.to(recipientSocket.socketId).emit('message:receive', {
            message,
            sender: {
              id: socket.user._id,
              name: socket.user.name
            }
          });
        }

        // Send confirmation to sender
        socket.emit('message:sent', { message });
      } catch (error) {
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle message read status
    socket.on('message:read', async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);
        
        if (message && message.recipient.toString() === socket.user._id.toString()) {
          message.read = true;
          message.readAt = new Date();
          await message.save();

          // Notify sender that message was read
          const senderSocket = onlineUsers.get(message.sender.toString());
          if (senderSocket) {
            io.to(senderSocket.socketId).emit('message:read', {
              messageId,
              readAt: message.readAt
            });
          }
        }
      } catch (error) {
        socket.emit('error', { message: 'Error marking message as read' });
      }
    });

    // Handle typing status
    socket.on('typing:start', (data) => {
      const { recipientId } = data;
      const recipientSocket = onlineUsers.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit('typing:start', {
          userId: socket.user._id,
          name: socket.user.name
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { recipientId } = data;
      const recipientSocket = onlineUsers.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit('typing:stop', {
          userId: socket.user._id
        });
      }
    });

    // Handle post interactions
    socket.on('post:like', async (data) => {
      try {
        const { postId } = data;
        // Emit to all users in the same community
        io.emit('post:liked', {
          postId,
          userId: socket.user._id,
          name: socket.user.name
        });
      } catch (error) {
        socket.emit('error', { message: 'Error liking post' });
      }
    });

    socket.on('post:comment', async (data) => {
      try {
        const { postId, comment } = data;
        // Emit to all users in the same community
        io.emit('post:commented', {
          postId,
          userId: socket.user._id,
          name: socket.user.name,
          comment
        });
      } catch (error) {
        socket.emit('error', { message: 'Error commenting on post' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      onlineUsers.delete(socket.user._id.toString());
      socket.broadcast.emit('user:offline', {
        userId: socket.user._id
      });
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
  onlineUsers
}; 