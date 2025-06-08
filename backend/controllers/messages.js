const Message = require('../models/Message');
const User = require('../models/User');

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all messages where user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    // Group messages by conversation
    const conversations = {};
    messages.forEach(message => {
      const otherUserId = message.sender._id.toString() === userId 
        ? message.receiver._id.toString() 
        : message.sender._id.toString();
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user: message.sender._id.toString() === userId ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: 0
        };
      }
      
      if (!message.read && message.receiver._id.toString() === userId) {
        conversations[otherUserId].unreadCount++;
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user && req.user._id ? req.user._id.toString() : undefined;

    // Debug logs
    console.log('req.user:', req.user);
    console.log('req.user._id:', req.user?._id);

    if (!senderId) {
      return res.status(401).json({ message: 'Sender not authenticated' });
    }

    // Handle media file if present
    let mediaUrl = null;
    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content || '',
      media: mediaUrl
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.remove();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
}; 