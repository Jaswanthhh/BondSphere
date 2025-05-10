const crypto = require('crypto');
const config = require('../config/email');
const logger = require('../utils/logger');
const emailTracking = require('./emailTracking');

// Verify webhook signature
const verifySignature = (payload, signature) => {
  const hmac = crypto.createHmac('sha256', config.webhookSecret);
  const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
};

// Process webhook event
const processWebhook = async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const payload = req.body;

  try {
    // Verify signature
    if (!verifySignature(payload, signature)) {
      logger.warn('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, emailId, data } = payload;

    switch (event) {
      case 'delivered':
        await handleDelivered(emailId, data);
        break;
      case 'opened':
        await handleOpened(emailId, data);
        break;
      case 'clicked':
        await handleClicked(emailId, data);
        break;
      case 'bounced':
        await handleBounced(emailId, data);
        break;
      case 'complained':
        await handleComplained(emailId, data);
        break;
      default:
        logger.warn(`Unknown webhook event: ${event}`);
        return res.status(400).json({ error: 'Unknown event type' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle delivered event
const handleDelivered = async (emailId, data) => {
  try {
    await emailTracking.trackEmailSent(emailId, data.type, data.recipient);
    logger.info(`Email delivered: ${emailId}`);
  } catch (error) {
    logger.error(`Error handling delivered event for ${emailId}:`, error);
  }
};

// Handle opened event
const handleOpened = async (emailId, data) => {
  try {
    await emailTracking.trackEmailOpened(emailId);
    logger.info(`Email opened: ${emailId}`);
  } catch (error) {
    logger.error(`Error handling opened event for ${emailId}:`, error);
  }
};

// Handle clicked event
const handleClicked = async (emailId, data) => {
  try {
    await emailTracking.trackLinkClicked(emailId, data.linkType);
    logger.info(`Email link clicked: ${emailId} - ${data.linkType}`);
  } catch (error) {
    logger.error(`Error handling clicked event for ${emailId}:`, error);
  }
};

// Handle bounced event
const handleBounced = async (emailId, data) => {
  try {
    await emailTracking.trackEmailBounced(emailId, data.reason);
    logger.warn(`Email bounced: ${emailId} - ${data.reason}`);
  } catch (error) {
    logger.error(`Error handling bounced event for ${emailId}:`, error);
  }
};

// Handle complained event
const handleComplained = async (emailId, data) => {
  try {
    // Update user preferences to not receive marketing emails
    if (data.type === 'marketing') {
      // TODO: Update user preferences
      logger.warn(`User complained about marketing email: ${emailId}`);
    }
  } catch (error) {
    logger.error(`Error handling complained event for ${emailId}:`, error);
  }
};

// Get webhook events
const getWebhookEvents = async (emailId) => {
  try {
    const status = await emailTracking.getEmailStatus(emailId);
    return status;
  } catch (error) {
    logger.error(`Error getting webhook events for ${emailId}:`, error);
    return null;
  }
};

module.exports = {
  processWebhook,
  getWebhookEvents
}; 