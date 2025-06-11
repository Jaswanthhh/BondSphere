const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const usersController = require('../controllers/usersController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config for avatar uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// PUT /api/users/me (update profile, including avatar and coverImage uploads)
router.put('/me', auth, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };
    // Parse arrays/objects if sent as JSON strings
    if (typeof updates.skills === 'string' && updates.skills.trim() !== '') {
      updates.skills = JSON.parse(updates.skills);
    } else if (typeof updates.skills === 'string') {
      updates.skills = [];
    }
    if (typeof updates.experience === 'string' && updates.experience.trim() !== '') {
      updates.experience = JSON.parse(updates.experience);
    } else if (typeof updates.experience === 'string') {
      updates.experience = [];
    }
    if (typeof updates.education === 'string' && updates.education.trim() !== '') {
      updates.education = JSON.parse(updates.education);
    } else if (typeof updates.education === 'string') {
      updates.education = [];
    }
    if (typeof updates.workType === 'string' && updates.workType.trim() !== '') {
      updates.workType = JSON.parse(updates.workType);
    } else if (typeof updates.workType === 'string') {
      updates.workType = [];
    }
    if (typeof updates.socialLinks === 'string') updates.socialLinks = JSON.parse(updates.socialLinks);
    // Defensive parse and sanitize for friends
    if (Object.prototype.hasOwnProperty.call(updates, 'friends')) {
      if (typeof updates.friends === 'string') {
        try {
          updates.friends = JSON.parse(updates.friends);
        } catch {
          updates.friends = [];
        }
      }
      if (Array.isArray(updates.friends)) {
        updates.friends = updates.friends.filter(id => !!id && id !== '');
      } else {
        updates.friends = [];
      }
    }
    // Defensive parse and sanitize for sentFriendRequests
    if (Object.prototype.hasOwnProperty.call(updates, 'sentFriendRequests')) {
      if (typeof updates.sentFriendRequests === 'string') {
        try {
          updates.sentFriendRequests = JSON.parse(updates.sentFriendRequests);
        } catch {
          updates.sentFriendRequests = [];
        }
      }
      if (Array.isArray(updates.sentFriendRequests)) {
        updates.sentFriendRequests = updates.sentFriendRequests.filter(id => !!id && id !== '');
      } else {
        updates.sentFriendRequests = [];
      }
    }
    // Defensive parse and sanitize for receivedFriendRequests
    if (Object.prototype.hasOwnProperty.call(updates, 'receivedFriendRequests')) {
      if (typeof updates.receivedFriendRequests === 'string') {
        try {
          updates.receivedFriendRequests = JSON.parse(updates.receivedFriendRequests);
        } catch {
          updates.receivedFriendRequests = [];
        }
      }
      if (Array.isArray(updates.receivedFriendRequests)) {
        updates.receivedFriendRequests = updates.receivedFriendRequests.filter(id => !!id && id !== '');
      } else {
        updates.receivedFriendRequests = [];
      }
    }
    // Handle avatar and coverImage
    if (req.files?.avatar?.[0]) {
      updates.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.coverImage?.[0]) {
      updates.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Friend-related routes
router.get('/discover', auth, usersController.getAllUsers);
router.post('/friend-request', auth, usersController.sendFriendRequest);
router.post('/friend-request/accept', auth, usersController.acceptFriendRequest);
router.post('/friend-request/reject', auth, usersController.rejectFriendRequest);
router.get('/friend-requests', auth, usersController.getFriendRequests);
router.get('/friends', auth, usersController.getFriends);

// Aliases for frontend compatibility
router.get('/connections', auth, usersController.getFriends);
router.get('/connection-requests', auth, usersController.getFriendRequests);
router.get('/chat/contacts', auth, usersController.getFriends);

// Job Profile endpoints
router.get('/job-profile', auth, usersController.getJobProfile);
router.put('/job-profile', auth, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), usersController.updateJobProfile);

module.exports = router; 