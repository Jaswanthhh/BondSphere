const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { body, validationResult } = require('express-validator');

// Send message
router.post('/', auth, [
  body('recipient')
    .notEmpty()
    .withMessage('Recipient is required'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient, content } = req.body;

    // Check if recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const message = new Message({
      sender: req.user._id,
      recipient,
      content
    });

    await message.save();

    // Create notification
    const notification = new Notification({
      recipient,
      type: 'message',
      sender: req.user._id,
      content: `New message from ${req.user.name}`,
      data: { messageId: message._id },
      priority: 'normal',
      channels: ['in_app']
    });

    await notification.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

// Get conversation with user
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'name')
    .populate('recipient', 'name');

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' });
  }
});

// Get all conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get unique users from messages
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .sort({ createdAt: -1 });

    const userIds = new Set();
    const conversations = [];

    for (const message of messages) {
      const otherUserId = message.sender.toString() === req.user._id.toString()
        ? message.recipient.toString()
        : message.sender.toString();

      if (!userIds.has(otherUserId)) {
        userIds.add(otherUserId);
        const otherUser = await User.findById(otherUserId).select('name');
        conversations.push({
          user: otherUser,
          lastMessage: message
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is recipient
    if (message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to mark message as read' });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error marking message as read' });
  }
});

// Mark all messages from user as read
router.put('/conversation/:userId/read', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.userId,
        recipient: req.user._id,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking messages as read' });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is sender or recipient
    if (message.sender.toString() !== req.user._id.toString() &&
        message.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete message' });
    }

    await message.remove();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unread count' });
  }
});

module.exports = router; 