const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Post = require('../models/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name avatar').populate('comments.user', 'name avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create a post
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { content } = req.body;
    let media = '';
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }
    const post = new Post({
      user: req.user.id,
      content,
      media
    });
    await post.save();
    await post.populate('user', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add a comment to a post
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const comment = {
      user: req.user.id,
      content,
      createdAt: new Date()
    };
    post.comments.push(comment);
    await post.save();
    await post.populate('comments.user', 'name avatar');
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router; 