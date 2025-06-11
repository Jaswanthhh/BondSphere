const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // Uncomment if you use authentication

// Dummy data for demonstration; replace with your DB logic
const sharedLocations = [
  {
    userId: '1',
    userName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=1',
    location: { latitude: 37.7749, longitude: -122.4194, timestamp: Date.now() }
  },
  {
    userId: '2',
    userName: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=2',
    location: { latitude: 40.7128, longitude: -74.0060, timestamp: Date.now() }
  }
];

// GET /api/location/shared
router.get('/shared', /*auth,*/ (req, res) => {
  res.json(sharedLocations);
});

// GET /api/location/contacts
router.get('/contacts', (req, res) => {
  res.json([
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?u=3' }
  ]);
});

module.exports = router; 