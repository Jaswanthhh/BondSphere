const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');
const auth = require('../middlewares/auth');

router.post('/', auth, travelController.createTravel);
router.get('/', travelController.getAllTravels);
router.get('/:id', travelController.getTravelById);
router.put('/:id', auth, travelController.updateTravel);
router.delete('/:id', auth, travelController.deleteTravel);

module.exports = router; 