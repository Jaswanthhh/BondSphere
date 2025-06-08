const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/Story');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all stories
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find().populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create a story
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { type } = req.body;
    let media = '';
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }
    const story = new Story({
      user: req.user,
      media,
      type
    });
    await story.save();
    await story.populate('user', 'name avatar');
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router; 