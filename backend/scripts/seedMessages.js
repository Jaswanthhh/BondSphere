require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

const connectDB = require('../config/db');

// Connect to MongoDB
connectDB();

const seedMessages = async () => {
  try {
    // Get some users from the database
    const users = await User.find().limit(3);
    
    if (users.length < 2) {
      console.log('Need at least 2 users to create conversations');
      process.exit(1);
    }

    // Clear existing messages
    await Message.deleteMany({});

    // Create sample conversations
    const conversations = [
      {
        sender: users[0]._id,
        receiver: users[1]._id,
        content: "Hey! How's it going?",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      },
      {
        sender: users[1]._id,
        receiver: users[0]._id,
        content: "I'm good! Just working on some new features for the app.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5) // 1.5 hours ago
      },
      {
        sender: users[0]._id,
        receiver: users[1]._id,
        content: "That sounds interesting! What kind of features?",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        sender: users[0]._id,
        receiver: users[2]._id,
        content: "Hi! Are you going to the tech meetup next week?",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
      },
      {
        sender: users[2]._id,
        receiver: users[0]._id,
        content: "Yes, I'll be there! Looking forward to it.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23) // 23 hours ago
      },
      {
        sender: users[1]._id,
        receiver: users[2]._id,
        content: "Did you see the latest update to the project?",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      }
    ];

    // Insert messages
    await Message.insertMany(conversations);

    console.log('Sample messages seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding messages:', error);
    process.exit(1);
  }
};

seedMessages(); 