const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema); 