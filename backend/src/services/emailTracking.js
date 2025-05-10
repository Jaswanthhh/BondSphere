const Redis = require('ioredis');
const config = require('../config/email');
const logger = require('../utils/logger');

const redis = new Redis(config.redisUrl);

// Track email sent
const trackEmailSent = async (emailId, type, recipient) => {
  const timestamp = Date.now();
  const key = `email:${emailId}`;
  
  try {
    await redis.hmset(key, {
      type,
      recipient,
      sentAt: timestamp,
      status: 'sent'
    });
    await redis.expire(key, 30 * 24 * 60 * 60); // 30 days

    // Update type metrics
    await redis.hincrby(`email:metrics:${type}`, 'sent', 1);
    await redis.expire(`email:metrics:${type}`, 30 * 24 * 60 * 60);
  } catch (error) {
    logger.error('Error tracking email sent:', error);
  }
};

// Track email opened
const trackEmailOpened = async (emailId) => {
  const timestamp = Date.now();
  const key = `email:${emailId}`;
  
  try {
    const email = await redis.hgetall(key);
    if (email) {
      await redis.hmset(key, {
        openedAt: timestamp,
        status: 'opened'
      });

      // Update type metrics
      await redis.hincrby(`email:metrics:${email.type}`, 'opened', 1);
    }
  } catch (error) {
    logger.error('Error tracking email opened:', error);
  }
};

// Track link clicked
const trackLinkClicked = async (emailId, linkType) => {
  const timestamp = Date.now();
  const key = `email:${emailId}`;
  
  try {
    const email = await redis.hgetall(key);
    if (email) {
      await redis.hmset(key, {
        clickedAt: timestamp,
        clickedLink: linkType,
        status: 'clicked'
      });

      // Update type metrics
      await redis.hincrby(`email:metrics:${email.type}`, 'clicked', 1);
    }
  } catch (error) {
    logger.error('Error tracking link clicked:', error);
  }
};

// Track email bounced
const trackEmailBounced = async (emailId, reason) => {
  const timestamp = Date.now();
  const key = `email:${emailId}`;
  
  try {
    const email = await redis.hgetall(key);
    if (email) {
      await redis.hmset(key, {
        bouncedAt: timestamp,
        bounceReason: reason,
        status: 'bounced'
      });

      // Update type metrics
      await redis.hincrby(`email:metrics:${email.type}`, 'bounced', 1);
    }
  } catch (error) {
    logger.error('Error tracking email bounced:', error);
  }
};

// Get email metrics
const getEmailMetrics = async (type, period = '30d') => {
  try {
    const metrics = await redis.hgetall(`email:metrics:${type}`);
    return {
      sent: parseInt(metrics.sent) || 0,
      opened: parseInt(metrics.opened) || 0,
      clicked: parseInt(metrics.clicked) || 0,
      bounced: parseInt(metrics.bounced) || 0,
      openRate: calculateRate(metrics.opened, metrics.sent),
      clickRate: calculateRate(metrics.clicked, metrics.sent),
      bounceRate: calculateRate(metrics.bounced, metrics.sent)
    };
  } catch (error) {
    logger.error('Error getting email metrics:', error);
    return null;
  }
};

// Get email status
const getEmailStatus = async (emailId) => {
  try {
    return await redis.hgetall(`email:${emailId}`);
  } catch (error) {
    logger.error('Error getting email status:', error);
    return null;
  }
};

// Calculate rate percentage
const calculateRate = (numerator, denominator) => {
  if (!denominator) return 0;
  return ((numerator / denominator) * 100).toFixed(2);
};

// Clean up old metrics
const cleanupOldMetrics = async (days = 30) => {
  const timestamp = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  try {
    const keys = await redis.keys('email:*');
    for (const key of keys) {
      const email = await redis.hgetall(key);
      if (email.sentAt && email.sentAt < timestamp) {
        await redis.del(key);
      }
    }
  } catch (error) {
    logger.error('Error cleaning up old metrics:', error);
  }
};

// Schedule cleanup
setInterval(cleanupOldMetrics, 24 * 60 * 60 * 1000); // Daily cleanup

module.exports = {
  trackEmailSent,
  trackEmailOpened,
  trackLinkClicked,
  trackEmailBounced,
  getEmailMetrics,
  getEmailStatus,
  cleanupOldMetrics
}; 