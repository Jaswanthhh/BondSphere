require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');

// Connect to MongoDB
connectDB();

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create sample users
    const users = [
      {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/300?img=1',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.com',
        bio: 'Full Stack Developer at BondSphere.',
        location: 'New York, USA'
      },
      {
        username: 'janesmith',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/300?img=2',
        linkedin: 'https://linkedin.com/in/janesmith',
        twitter: 'https://twitter.com/janesmith',
        github: 'https://github.com/janesmith',
        website: 'https://janesmith.com',
        bio: 'Product Manager and avid traveler.',
        location: 'San Francisco, USA'
      },
      {
        username: 'mikejohnson',
        fullName: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/300?img=3',
        linkedin: 'https://linkedin.com/in/mikejohnson',
        twitter: 'https://twitter.com/mikejohnson',
        github: 'https://github.com/mikejohnson',
        website: 'https://mikejohnson.com',
        bio: 'UI/UX Designer passionate about user experience.',
        location: 'Austin, USA'
      }
    ];

    // Hash passwords and create users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    await User.insertMany(users);

    console.log('Sample users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers(); 