const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateCommunity } = require('../middleware/validation');
const Community = require('../models/Community');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create new community
router.post('/', auth, validateCommunity, async (req, res) => {
  try {
    const { name, description, type, rules } = req.body;

    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ error: 'Community name already exists' });
    }

    const community = new Community({
      name,
      description,
      type,
      rules,
      creator: req.user._id,
      moderators: [req.user._id]
    });

    await community.save();

    // Add creator as member
    await community.addMember(req.user._id);

    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: 'Error creating community' });
  }
});

// Get all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('creator', 'name')
      .populate('moderators', 'name')
      .select('-members');
    
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching communities' });
  }
});

// Get community by ID
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('creator', 'name')
      .populate('moderators', 'name')
      .populate('members', 'name');
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching community' });
  }
});

// Update community
router.put('/:id', auth, validateCommunity, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is moderator
    if (!community.moderators.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to update community' });
    }

    const { name, description, type, rules } = req.body;
    
    // Check if new name already exists
    if (name !== community.name) {
      const existingCommunity = await Community.findOne({ name });
      if (existingCommunity) {
        return res.status(400).json({ error: 'Community name already exists' });
      }
    }

    community.name = name;
    community.description = description;
    community.type = type;
    community.rules = rules;

    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Error updating community' });
  }
});

// Delete community
router.delete('/:id', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is creator
    if (community.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete community' });
    }

    await community.remove();
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting community' });
  }
});

// Join community
router.post('/:id/join', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is already a member
    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already a member of this community' });
    }

    await community.addMember(req.user._id);

    // Notify moderators
    const notification = new Notification({
      recipient: community.moderators[0], // Notify first moderator
      type: 'community_join',
      sender: req.user._id,
      content: `${req.user.name} joined ${community.name}`,
      data: { communityId: community._id },
      priority: 'normal',
      channels: ['in_app']
    });

    await notification.save();

    res.json({ message: 'Joined community successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error joining community' });
  }
});

// Leave community
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is a member
    if (!community.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'Not a member of this community' });
    }

    // Check if user is creator
    if (community.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Creator cannot leave community' });
    }

    await community.removeMember(req.user._id);
    res.json({ message: 'Left community successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error leaving community' });
  }
});

// Get community members
router.get('/:id/members', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members', 'name email');
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(community.members);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching members' });
  }
});

// Add moderator
router.post('/:id/moderators', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is creator
    if (community.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to add moderators' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a moderator
    if (community.moderators.includes(userId)) {
      return res.status(400).json({ error: 'User is already a moderator' });
    }

    community.moderators.push(userId);
    await community.save();

    // Notify new moderator
    const notification = new Notification({
      recipient: userId,
      type: 'moderator_added',
      sender: req.user._id,
      content: `You were made a moderator of ${community.name}`,
      data: { communityId: community._id },
      priority: 'high',
      channels: ['in_app']
    });

    await notification.save();

    res.json({ message: 'Moderator added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding moderator' });
  }
});

// Remove moderator
router.delete('/:id/moderators/:userId', auth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is creator
    if (community.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to remove moderators' });
    }

    // Check if user is a moderator
    if (!community.moderators.includes(req.params.userId)) {
      return res.status(400).json({ error: 'User is not a moderator' });
    }

    community.moderators = community.moderators.filter(
      id => id.toString() !== req.params.userId
    );
    await community.save();

    // Notify removed moderator
    const notification = new Notification({
      recipient: req.params.userId,
      type: 'moderator_removed',
      sender: req.user._id,
      content: `You were removed as a moderator of ${community.name}`,
      data: { communityId: community._id },
      priority: 'high',
      channels: ['in_app']
    });

    await notification.save();

    res.json({ message: 'Moderator removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing moderator' });
  }
});

module.exports = router; 