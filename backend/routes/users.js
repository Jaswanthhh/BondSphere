const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');
const usersController = require('../controllers/usersController');

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

// Friend-related routes
router.get('/discover', auth, usersController.getAllUsers);
router.post('/friend-request', auth, usersController.sendFriendRequest);
router.post('/friend-request/accept', auth, usersController.acceptFriendRequest);
router.post('/friend-request/reject', auth, usersController.rejectFriendRequest);
router.get('/friend-requests', auth, usersController.getFriendRequests);
router.get('/friends', auth, usersController.getFriends);

module.exports = router; 