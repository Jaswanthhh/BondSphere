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

// Send friend request
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

    // Add each other as friends immediately
    currentUser.friends.push(targetUserId);
    targetUser.friends.push(req.user._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'Friend added successfully' });
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
      .populate('receivedFriendRequests', 'name email avatar')
      .populate('sentFriendRequests', 'name email avatar');
    
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
      .populate('friends', 'name email avatar');
    
    res.json(user.friends);
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
  getFriends
}; 