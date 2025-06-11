const User = require('../models/User');

// Get all users (for people discovery)
const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { _id: { $ne: req.user._id } };

    // Add search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -refreshToken')
      .select('fullName username email avatar bio location')
      .lean();

    // Add friend status to each user
    const currentUser = await User.findById(req.user._id)
      .select('friends sentFriendRequests receivedFriendRequests')
      .lean();

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const enhancedUsers = users.map(user => ({
      ...user,
      isFriend: (currentUser.friends || []).includes(user._id),
      hasSentRequest: (currentUser.sentFriendRequests || []).includes(user._id),
      hasReceivedRequest: (currentUser.receivedFriendRequests || []).includes(user._id)
    }));

    res.json(enhancedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send friend request (auto-accept)
const sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.friends.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Auto-accept: Add each other as friends immediately
    currentUser.friends.push(targetUserId);
    targetUser.friends.push(req.user._id);
    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend added successfully (auto-accepted)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestUserId } = req.body;
    const currentUser = await User.findById(req.user._id);
    const requestUser = await User.findById(requestUserId);

    if (!requestUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.receivedFriendRequests.includes(requestUserId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Remove from friend requests
    currentUser.receivedFriendRequests = currentUser.receivedFriendRequests.filter(
      id => id.toString() !== requestUserId
    );
    requestUser.sentFriendRequests = requestUser.sentFriendRequests.filter(
      id => id.toString() !== req.user._id
    );

    // Add to friends list
    currentUser.friends.push(requestUserId);
    requestUser.friends.push(req.user._id);

    await currentUser.save();
    await requestUser.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestUserId } = req.body;
    const currentUser = await User.findById(req.user._id);
    const requestUser = await User.findById(requestUserId);

    if (!requestUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from friend requests
    currentUser.receivedFriendRequests = currentUser.receivedFriendRequests.filter(
      id => id.toString() !== requestUserId
    );
    requestUser.sentFriendRequests = requestUser.sentFriendRequests.filter(
      id => id.toString() !== req.user._id
    );

    await currentUser.save();
    await requestUser.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friend requests
const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('receivedFriendRequests', 'fullName username avatar email location bio linkedin twitter github website skills experience education workType availability preferredRole salary coverImage jobProfile')
      .populate('sentFriendRequests', 'fullName username avatar email location bio linkedin twitter github website skills experience education workType availability preferredRole salary coverImage jobProfile');
    res.json({
      received: user.receivedFriendRequests,
      sent: user.sentFriendRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friends list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'fullName username avatar email location bio linkedin twitter github website skills experience education workType availability preferredRole salary coverImage jobProfile');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's job profile
const getJobProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('jobProfile');
    res.json(user.jobProfile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update current user's job profile
const updateJobProfile = async (req, res) => {
  try {
    let updates = { ...req.body };
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
    // Handle avatar and coverImage
    if (req.files?.avatar?.[0]) {
      updates.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.coverImage?.[0]) {
      updates.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }
    // Merge updates into existing jobProfile
    const user = await User.findById(req.user._id);
    user.jobProfile = { ...user.jobProfile.toObject(), ...updates };
    await user.save();
    res.json(user.jobProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // ... existing exports ...
  getAllUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  getJobProfile,
  updateJobProfile
}; 