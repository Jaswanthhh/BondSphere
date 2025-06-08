const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: 'all' },
  type: { type: String, enum: ['normal', 'verified', 'private'], default: 'normal' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', CommunitySchema); 