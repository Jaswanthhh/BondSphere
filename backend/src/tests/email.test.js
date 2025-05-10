const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const EmailPreference = require('../models/EmailPreference');
const emailTracking = require('../services/emailTracking');
const emailQueue = require('../services/emailQueue');
const emailWebhook = require('../services/emailWebhook');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Email Preferences', () => {
  let userId;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
  });

  afterEach(async () => {
    await EmailPreference.deleteMany({});
  });

  test('should create default preferences for new user', async () => {
    const preferences = await EmailPreference.getOrCreate(userId);
    expect(preferences.user.toString()).toBe(userId.toString());
    expect(preferences.preferences.notifications.comments).toBe(true);
    expect(preferences.preferences.marketing.newsletters).toBe(false);
  });

  test('should update preferences', async () => {
    const preferences = await EmailPreference.getOrCreate(userId);
    await preferences.updatePreferences({
      notifications: { comments: false },
      marketing: { newsletters: true }
    });

    const updated = await EmailPreference.findById(preferences._id);
    expect(updated.preferences.notifications.comments).toBe(false);
    expect(updated.preferences.marketing.newsletters).toBe(true);
  });

  test('should check if user should receive email', async () => {
    const preferences = await EmailPreference.getOrCreate(userId);
    expect(preferences.shouldReceiveEmail('comments', 'notifications')).toBe(true);
    expect(preferences.shouldReceiveEmail('newsletters', 'marketing')).toBe(false);
  });
});

describe('Email Tracking', () => {
  beforeEach(async () => {
    // Clear Redis keys before each test
    // Note: In a real test environment, you'd use a test Redis instance
  });

  test('should track email sent', async () => {
    const emailId = 'test-email-1';
    await emailTracking.trackEmailSent(emailId, 'notification', 'test@example.com');
    const status = await emailTracking.getEmailStatus(emailId);
    expect(status.status).toBe('sent');
  });

  test('should track email opened', async () => {
    const emailId = 'test-email-2';
    await emailTracking.trackEmailSent(emailId, 'notification', 'test@example.com');
    await emailTracking.trackEmailOpened(emailId);
    const status = await emailTracking.getEmailStatus(emailId);
    expect(status.status).toBe('opened');
  });

  test('should track link clicked', async () => {
    const emailId = 'test-email-3';
    await emailTracking.trackEmailSent(emailId, 'notification', 'test@example.com');
    await emailTracking.trackLinkClicked(emailId, 'button');
    const status = await emailTracking.getEmailStatus(emailId);
    expect(status.status).toBe('clicked');
    expect(status.clickedLink).toBe('button');
  });

  test('should track email bounced', async () => {
    const emailId = 'test-email-4';
    await emailTracking.trackEmailSent(emailId, 'notification', 'test@example.com');
    await emailTracking.trackEmailBounced(emailId, 'invalid-email');
    const status = await emailTracking.getEmailStatus(emailId);
    expect(status.status).toBe('bounced');
    expect(status.bounceReason).toBe('invalid-email');
  });
});

describe('Email Queue', () => {
  test('should add email to queue', async () => {
    const emailData = {
      emailId: 'test-email-5',
      type: 'notification',
      to: 'test@example.com',
      subject: 'Test Email',
      template: 'notification',
      data: { name: 'Test User' }
    };

    const jobId = await emailQueue.queueEmail(emailData);
    expect(jobId).toBeDefined();
  });

  test('should get queue status', async () => {
    const status = await emailQueue.getQueueStatus();
    expect(status).toHaveProperty('waiting');
    expect(status).toHaveProperty('active');
    expect(status).toHaveProperty('completed');
    expect(status).toHaveProperty('failed');
  });
});

describe('Email Webhook', () => {
  test('should verify webhook signature', () => {
    const payload = { event: 'test', emailId: 'test-email-6' };
    const signature = 'test-signature';
    const isValid = emailWebhook.verifySignature(payload, signature);
    expect(typeof isValid).toBe('boolean');
  });

  test('should process webhook event', async () => {
    const req = {
      headers: { 'x-webhook-signature': 'test-signature' },
      body: {
        event: 'delivered',
        emailId: 'test-email-7',
        data: { type: 'notification', recipient: 'test@example.com' }
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await emailWebhook.processWebhook(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
}); 