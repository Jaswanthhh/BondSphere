const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

describe('Notification Model Test', () => {
  let testUser;
  let testSender;
  let testNotification;

  beforeAll(async () => {
    // Create test users
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    testSender = await User.create({
      name: 'Test Sender',
      email: 'sender@example.com',
      password: 'password123'
    });

    // Create test notification
    testNotification = await Notification.create({
      recipient: testUser._id,
      type: 'friend_request',
      sender: testSender._id,
      content: 'Test notification content',
      data: {
        requestId: new mongoose.Types.ObjectId()
      },
      priority: 'high',
      channels: ['email', 'push']
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Notification.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Notification Creation', () => {
    it('should create a new notification successfully', async () => {
      const notification = await Notification.create({
        recipient: testUser._id,
        type: 'message',
        sender: testSender._id,
        content: 'New message notification',
        data: {
          messageId: new mongoose.Types.ObjectId()
        },
        priority: 'normal',
        channels: ['push']
      });

      expect(notification.recipient.toString()).toBe(testUser._id.toString());
      expect(notification.type).toBe('message');
      expect(notification.priority).toBe('normal');
      expect(notification.channels).toContain('push');
    });

    // Edge cases for notification creation
    it('should not create notification without required fields', async () => {
      try {
        await Notification.create({
          type: 'message',
          content: 'Test content'
        });
        fail('Should not create notification without required fields');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create notification with invalid type', async () => {
      try {
        await Notification.create({
          recipient: testUser._id,
          type: 'invalid_type',
          content: 'Test content',
          priority: 'normal',
          channels: ['push']
        });
        fail('Should not create notification with invalid type');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create notification with invalid priority', async () => {
      try {
        await Notification.create({
          recipient: testUser._id,
          type: 'message',
          content: 'Test content',
          priority: 'invalid_priority',
          channels: ['push']
        });
        fail('Should not create notification with invalid priority');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create notification with invalid channels', async () => {
      try {
        await Notification.create({
          recipient: testUser._id,
          type: 'message',
          content: 'Test content',
          priority: 'normal',
          channels: ['invalid_channel']
        });
        fail('Should not create notification with invalid channels');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create notification with non-existent recipient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      try {
        await Notification.create({
          recipient: nonExistentId,
          type: 'message',
          content: 'Test content',
          priority: 'normal',
          channels: ['push']
        });
        fail('Should not create notification with non-existent recipient');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Notification Methods', () => {
    it('should mark notification as read', async () => {
      await testNotification.markAsRead();
      expect(testNotification.read).toBe(true);
      expect(testNotification.readAt).toBeDefined();
    });

    it('should mark notification action as taken', async () => {
      await testNotification.markActionTaken('accept');
      expect(testNotification.actionsTaken).toContain('accept');
      expect(testNotification.actionTakenAt).toBeDefined();
    });

    it('should record delivery attempt', async () => {
      await testNotification.recordDeliveryAttempt('email', true);
      const attempt = testNotification.deliveryAttempts[0];
      expect(attempt.channel).toBe('email');
      expect(attempt.success).toBe(true);
      expect(attempt.timestamp).toBeDefined();
    });

    // Edge cases for notification methods
    it('should not mark already read notification as read again', async () => {
      const readAt = testNotification.readAt;
      await testNotification.markAsRead();
      expect(testNotification.readAt).toBe(readAt);
    });

    it('should not mark invalid action as taken', async () => {
      try {
        await testNotification.markActionTaken('invalid_action');
        fail('Should not mark invalid action as taken');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not record delivery attempt for invalid channel', async () => {
      try {
        await testNotification.recordDeliveryAttempt('invalid_channel', true);
        fail('Should not record delivery attempt for invalid channel');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle failed delivery attempt', async () => {
      await testNotification.recordDeliveryAttempt('email', false, 'Failed to deliver');
      const attempt = testNotification.deliveryAttempts[testNotification.deliveryAttempts.length - 1];
      expect(attempt.success).toBe(false);
      expect(attempt.error).toBe('Failed to deliver');
    });
  });

  describe('Notification Static Methods', () => {
    it('should get unread notifications', async () => {
      const unreadNotifications = await Notification.getUnreadNotifications(testUser._id);
      expect(unreadNotifications.length).toBeGreaterThan(0);
    });

    it('should get notifications by type', async () => {
      const notifications = await Notification.getByType(testUser._id, 'friend_request');
      expect(notifications.length).toBeGreaterThan(0);
      expect(notifications[0].type).toBe('friend_request');
    });

    it('should create notification with default expiration', async () => {
      const notification = await Notification.createWithExpiration({
        recipient: testUser._id,
        type: 'message',
        content: 'Test content',
        priority: 'normal',
        channels: ['push']
      });
      expect(notification.expiresAt).toBeDefined();
    });

    // Edge cases for static methods
    it('should handle non-existent user in getUnreadNotifications', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const notifications = await Notification.getUnreadNotifications(nonExistentId);
      expect(notifications).toHaveLength(0);
    });

    it('should handle invalid type in getByType', async () => {
      const notifications = await Notification.getByType(testUser._id, 'invalid_type');
      expect(notifications).toHaveLength(0);
    });

    it('should handle custom expiration in createWithExpiration', async () => {
      const customExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const notification = await Notification.createWithExpiration({
        recipient: testUser._id,
        type: 'message',
        content: 'Test content',
        priority: 'normal',
        channels: ['push'],
        expiresAt: customExpiration
      });
      expect(notification.expiresAt.getTime()).toBe(customExpiration.getTime());
    });
  });

  describe('Notification Indexes', () => {
    it('should have index on recipient and createdAt', async () => {
      const indexes = await Notification.collection.indexes();
      const recipientIndex = indexes.find(index => 
        index.key.recipient === 1 && 
        index.key.createdAt === 1
      );
      expect(recipientIndex).toBeDefined();
    });

    it('should have index on recipient and read status', async () => {
      const indexes = await Notification.collection.indexes();
      const readIndex = indexes.find(index => 
        index.key.recipient === 1 && 
        index.key.read === 1
      );
      expect(readIndex).toBeDefined();
    });

    it('should have TTL index on expiresAt', async () => {
      const indexes = await Notification.collection.indexes();
      const ttlIndex = indexes.find(index => 
        index.key.expiresAt === 1 && 
        index.expireAfterSeconds === 0
      );
      expect(ttlIndex).toBeDefined();
    });

    // Edge cases for indexes
    it('should handle duplicate notifications', async () => {
      try {
        await Notification.create({
          recipient: testUser._id,
          type: 'friend_request',
          sender: testSender._id,
          content: 'Test notification content',
          data: {
            requestId: testNotification.data.requestId
          },
          priority: 'high',
          channels: ['email', 'push']
        });
        fail('Should not create duplicate notifications');
      } catch (error) {
        expect(error.code).toBe(11000);
      }
    });
  });
}); 