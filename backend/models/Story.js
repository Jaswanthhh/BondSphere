const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  media: { type: String, required: true }, // URL or file path
  type: { type: String, enum: ['image', 'video'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema); 