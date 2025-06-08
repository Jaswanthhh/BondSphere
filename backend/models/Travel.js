const mongoose = require('mongoose');

const TravelSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  preferences: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Travel', TravelSchema); 