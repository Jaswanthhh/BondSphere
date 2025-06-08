const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

router.get('/messages/:roomId', auth, chatController.getMessages);

module.exports = router; 