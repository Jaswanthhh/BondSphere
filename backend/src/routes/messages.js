const express = require('express');
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');

const router = express.Router();

// @route   POST api/messages
// @desc    Send a new message
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('receiverId', 'Receiver ID is required').not().isEmpty(),
      check('content', 'Message content is required').not().isEmpty()
    ]
  ],
  sendMessage
);

// @route   GET api/messages/conversation/:userId
// @desc    Get conversation with a user
// @access  Private
router.get('/conversation/:userId', auth, getConversation);

// @route   PUT api/messages/read
// @desc    Mark messages as read
// @access  Private
router.put(
  '/read',
  [
    auth,
    [
      check('messageIds', 'Message IDs are required').isArray()
    ]
  ],
  markAsRead
);

// @route   DELETE api/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/:messageId', auth, deleteMessage);

module.exports = router; 