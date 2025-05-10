const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Community = require('../models/Community');
const Post = require('../models/Post');
const config = require('../config/config');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    });
    console.log('Created test user');

    // Create test community
    const community = await Community.create({
      name: 'Test Community',
      description: 'A test community for development',
      creator: user._id,
      members: [{
        user: user._id,
        role: 'admin'
      }]
    });
    console.log('Created test community');

    // Create test post
    const post = await Post.create({
      title: 'Welcome to Test Community',
      content: 'This is a test post to get started with our community.',
      author: user._id,
      community: community._id
    });
    console.log('Created test post');

    // Update user with community
    user.communities.push(community._id);
    await user.save();
    console.log('Updated user with community');

    // Update community with post
    community.posts.push(post._id);
    await community.save();
    console.log('Updated community with post');

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData(); 