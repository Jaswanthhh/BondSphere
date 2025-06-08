const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const auth = require('../middlewares/auth');

router.post('/', auth, communityController.createCommunity);
router.get('/', communityController.getAllCommunities);
router.get('/:id', communityController.getCommunityById);
router.put('/:id', auth, communityController.updateCommunity);
router.delete('/:id', auth, communityController.deleteCommunity);
router.post('/:id/join', auth, communityController.joinCommunity);
router.post('/:id/leave', auth, communityController.leaveCommunity);
router.get('/:id/chat/messages', auth, communityController.getCommunityChatMessages);
router.post('/:id/chat/messages', auth, communityController.sendCommunityChatMessage);

module.exports = router; 