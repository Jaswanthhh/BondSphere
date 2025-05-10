const Queue = require('bull');
const config = require('../config/email');
const logger = require('../utils/logger');
const emailService = require('./emailService');
const emailTracking = require('./emailTracking');

// Create email queue
const emailQueue = new Queue('email', {
  redis: config.redisUrl,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Process email queue
emailQueue.process(async (job) => {
  const { emailId, type, to, subject, template, data } = job.data;
  
  try {
    // Send email
    await emailService.sendEmail({
      to,
      subject,
      template,
      data
    });

    // Track email sent
    await emailTracking.trackEmailSent(emailId, type, to);

    logger.info(`Email sent successfully: ${emailId}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error sending email ${emailId}:`, error);
    throw error;
  }
});

// Handle failed jobs
emailQueue.on('failed', async (job, error) => {
  const { emailId, type, to } = job.data;
  
  try {
    // Track email bounced
    await emailTracking.trackEmailBounced(emailId, error.message);
    
    // Log failure
    logger.error(`Email ${emailId} failed after ${job.attemptsMade} attempts:`, error);
  } catch (trackingError) {
    logger.error('Error tracking failed email:', trackingError);
  }
});

// Add email to queue
const queueEmail = async (emailData) => {
  try {
    const job = await emailQueue.add(emailData, {
      priority: getEmailPriority(emailData.type)
    });
    return job.id;
  } catch (error) {
    logger.error('Error queueing email:', error);
    throw error;
  }
};

// Get email priority
const getEmailPriority = (type) => {
  const priorities = {
    'password-reset': 1,
    'verification': 2,
    'notification': 3,
    'marketing': 4
  };
  return priorities[type] || 5;
};

// Get queue status
const getQueueStatus = async () => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      emailQueue.getWaitingCount(),
      emailQueue.getActiveCount(),
      emailQueue.getCompletedCount(),
      emailQueue.getFailedCount()
    ]);

    return {
      waiting,
      active,
      completed,
      failed
    };
  } catch (error) {
    logger.error('Error getting queue status:', error);
    return null;
  }
};

// Clean up old failed jobs
const cleanupFailedJobs = async (days = 7) => {
  try {
    const failedJobs = await emailQueue.getFailed();
    const timestamp = Date.now() - (days * 24 * 60 * 60 * 1000);

    for (const job of failedJobs) {
      if (job.finishedOn && job.finishedOn < timestamp) {
        await job.remove();
      }
    }
  } catch (error) {
    logger.error('Error cleaning up failed jobs:', error);
  }
};

// Schedule cleanup
setInterval(cleanupFailedJobs, 24 * 60 * 60 * 1000); // Daily cleanup

module.exports = {
  queueEmail,
  getQueueStatus,
  cleanupFailedJobs
}; 