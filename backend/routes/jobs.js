const express = require('express');
const router = express.Router();

// Example: GET /api/jobs
router.get('/', (req, res) => {
  res.json([
    { id: 1, title: 'Frontend Developer', company: 'Acme Inc.' },
    { id: 2, title: 'Backend Developer', company: 'Beta Corp.' }
  ]);
});

module.exports = router; 