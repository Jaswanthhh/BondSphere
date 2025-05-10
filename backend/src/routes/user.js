const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Community = require('../models/Community');
const Notification = require('../models/Notification');
const { body, validationResult } = require('express-validator');

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetToken -resetTokenExpiry')
      .populate('communities', 'name')
      .populate('friends', 'name');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('Social links must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio, location, interests, socialLinks } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (interests) user.interests = interests;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Send friend request
router.post('/:id/friend-request', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already friends
    if (targetUser.friends.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }

    // Check if request already sent
    if (targetUser.friendRequests.includes(req.user._id)) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    targetUser.friendRequests.push(req.user._id);
    await targetUser.save();

    // Create notification
    const notification = new Notification({
      recipient: targetUser._id,
      type: 'friend_request',
      sender: req.user._id,
      content: `${req.user.name} sent you a friend request`,
      data: { userId: req.user._id },
      priority: 'normal',
      channels: ['in_app']
    });

    await notification.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend request' });
  }
});

// Accept friend request
router.post('/friend-requests/:id/accept', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if request exists
    if (!user.friendRequests.includes(req.params.id)) {
      return res.status(400).json({ error: 'No friend request from this user' });
    }

    // Add to friends list
    user.friends.push(req.params.id);
    user.friendRequests = user.friendRequests.filter(
      id => id.toString() !== req.params.id
    );

    // Add current user to other user's friends list
    const otherUser = await User.findById(req.params.id);
    otherUser.friends.push(req.user._id);

    await Promise.all([user.save(), otherUser.save()]);

    // Create notification
    const notification = new Notification({
      recipient: req.params.id,
      type: 'friend_request_accepted',
      sender: req.user._id,
      content: `${req.user.name} accepted your friend request`,
      data: { userId: req.user._id },
      priority: 'normal',
      channels: ['in_app']
    });

    await notification.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Error accepting friend request' });
  }
});

// Reject friend request
router.post('/friend-requests/:id/reject', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if request exists
    if (!user.friendRequests.includes(req.params.id)) {
      return res.status(400).json({ error: 'No friend request from this user' });
    }

    // Remove from friend requests
    user.friendRequests = user.friendRequests.filter(
      id => id.toString() !== req.params.id
    );

    await user.save();
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting friend request' });
  }
});

// Remove friend
router.delete('/friends/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if friends
    if (!user.friends.includes(req.params.id)) {
      return res.status(400).json({ error: 'Not friends with this user' });
    }

    // Remove from friends list
    user.friends = user.friends.filter(
      id => id.toString() !== req.params.id
    );

    // Remove from other user's friends list
    const otherUser = await User.findById(req.params.id);
    otherUser.friends = otherUser.friends.filter(
      id => id.toString() !== req.user._id
    );

    await Promise.all([user.save(), otherUser.save()]);
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing friend' });
  }
});

// Get user's communities
router.get('/:id/communities', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('communities', 'name description memberCount');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.communities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user communities' });
  }
});

// Get user's posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('community', 'name')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user posts' });
  }
});

// Get user's achievements
router.get('/:id/achievements', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('achievements.achievement');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user achievements' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name email')
    .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
});

module.exports = router; 