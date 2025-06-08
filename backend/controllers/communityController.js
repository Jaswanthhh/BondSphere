const Community = require('../models/Community');
const User = require('../models/User');
const CommunityMessage = require('../models/CommunityMessage');

// Get all communities
exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communities', error: error.message });
  }
};

// Create a new community
exports.createCommunity = async (req, res) => {
  try {
    const { name, description, image, category, type } = req.body;
    // Add creator as first member if authenticated
    const members = req.user ? [req.user._id] : [];
    const community = new Community({
      name,
      description,
      image,
      category,
      type,
      members
    });
    await community.save();
    // Seed a welcome message if a sender is available
    let senderId = req.user?._id;
    if (!senderId && community.members.length > 0) {
      senderId = community.members[0];
    }
    if (senderId) {
      const welcomeMessage = new CommunityMessage({
        community: community._id,
        sender: senderId,
        content: `Welcome to the ${name} community! Start the conversation below.`
      });
      await welcomeMessage.save();
    }
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error creating community', error: error.message });
  }
};

// Get a community by ID
exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community', error: error.message });
  }
};

// Update a community
exports.updateCommunity = async (req, res) => {
  try {
    const { name, description, image, category, type } = req.body;
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { name, description, image, category, type },
      { new: true }
    );
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error updating community', error: error.message });
  }
};

// Delete a community
exports.deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findByIdAndDelete(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting community', error: error.message });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();
    }
    res.json({ message: 'Joined community' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining community', error: error.message });
  }
};

// Leave a community
exports.leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    community.members = community.members.filter(
      memberId => memberId.toString() !== req.user._id.toString()
    );
    await community.save();
    res.json({ message: 'Left community' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving community', error: error.message });
  }
};

// Get all chat messages for a community
exports.getCommunityChatMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find({ community: req.params.id })
      .populate('sender', 'fullName avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching community chat messages', error: error.message });
  }
};

// Send a chat message to a community
exports.sendCommunityChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = new CommunityMessage({
      community: req.params.id,
      sender: req.user._id,
      content: message
    });
    await newMessage.save();
    const populated = await newMessage.populate('sender', 'fullName avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error sending community chat message', error: error.message });
  }
}; 