const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// Example: GET /api/jobs
router.get('/', jobsController.getAllJobs);
router.post('/', jobsController.createJob);
router.get('/job-feed', (req, res) => {
  res.json([]); // Placeholder: return an empty array for job feed
});

module.exports = router; 