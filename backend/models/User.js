const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: { type: Object },
  avatar: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  github: { type: String, default: '' },
  website: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  about: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: [Object], default: [] },
  education: { type: [Object], default: [] },
  workType: { type: [String], default: [] },
  availability: { type: String, default: '' },
  preferredRole: { type: String, default: '' },
  salary: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sentFriendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  receivedFriendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  jobProfile: {
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: { type: [String], default: [] },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    experience: { type: [Object], default: [] },
    education: { type: [Object], default: [] },
    availability: { type: String, default: '' },
    preferredRole: { type: String, default: '' },
    salary: { type: String, default: '' },
    workType: { type: [String], default: [] },
    // Add more job-specific fields as needed
  },
});

module.exports = mongoose.model('User', UserSchema); 