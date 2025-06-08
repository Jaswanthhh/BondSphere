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
});

module.exports = mongoose.model('User', UserSchema); 