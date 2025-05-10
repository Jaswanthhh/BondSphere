const express = require('express');
const router = express.Router();
const emailWebhook = require('../services/emailWebhook');
const emailQueue = require('../services/emailQueue');
const emailTracking = require('../services/emailTracking');
const { auth } = require('../middleware/auth');

// Webhook endpoint for email events
router.post('/webhook', emailWebhook.processWebhook);

// Get email metrics (admin only)
router.get('/metrics', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { type, period } = req.query;
    const metrics = await emailTracking.getEmailMetrics(type, period);
    
    if (!metrics) {
      return res.status(404).json({ error: 'Metrics not found' });
    }

    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get email status
router.get('/status/:emailId', auth, async (req, res) => {
  try {
    const status = await emailWebhook.getWebhookEvents(req.params.emailId);
    
    if (!status) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get queue status (admin only)
router.get('/queue/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const status = await emailQueue.getQueueStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clean up failed jobs (admin only)
router.post('/queue/cleanup', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { days } = req.body;
    await emailQueue.cleanupFailedJobs(days);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 