const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Community = require('../models/Community');
const Post = require('../models/Post');
const Message = require('../models/Message');

describe('Analytics Model Test', () => {
  let testUser;
  let testCommunity;
  let testPost;
  let testMessage;
  let testAnalytics;

  beforeAll(async () => {
    // Create test entities
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    testCommunity = await Community.create({
      name: 'Test Community',
      description: 'Test community description',
      creator: testUser._id
    });

    testPost = await Post.create({
      title: 'Test Post',
      content: 'Test post content',
      author: testUser._id,
      community: testCommunity._id
    });

    testMessage = await Message.create({
      content: 'Test message',
      sender: testUser._id,
      recipient: testUser._id
    });

    // Create test analytics
    testAnalytics = await Analytics.create({
      entityType: 'community',
      entityId: testCommunity._id,
      date: new Date(),
      metrics: {
        views: 100,
        uniqueViews: 50,
        interactions: 25,
        engagement: 0.25,
        demographics: {
          ageGroups: { '18-24': 30, '25-34': 20 },
          gender: { male: 40, female: 10 }
        },
        devices: {
          mobile: 30,
          desktop: 20
        },
        sources: {
          direct: 25,
          referral: 25
        },
        peakHours: {
          '9': 10,
          '10': 15
        },
        retention: {
          '1d': 0.8,
          '7d': 0.5
        }
      }
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Message.deleteMany({});
    await Analytics.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Analytics Creation', () => {
    it('should create analytics for different entity types', async () => {
      const userAnalytics = await Analytics.create({
        entityType: 'user',
        entityId: testUser._id,
        date: new Date(),
        metrics: {
          views: 0,
          uniqueViews: 0,
          interactions: 0
        }
      });

      expect(userAnalytics.entityType).toBe('user');
      expect(userAnalytics.entityId.toString()).toBe(testUser._id.toString());
    });

    // Edge cases for analytics creation
    it('should not create analytics with invalid entity type', async () => {
      try {
        await Analytics.create({
          entityType: 'invalid_type',
          entityId: testUser._id,
          date: new Date(),
          metrics: {
            views: 0,
            uniqueViews: 0,
            interactions: 0
          }
        });
        fail('Should not create analytics with invalid entity type');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create analytics with non-existent entity ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      try {
        await Analytics.create({
          entityType: 'user',
          entityId: nonExistentId,
          date: new Date(),
          metrics: {
            views: 0,
            uniqueViews: 0,
            interactions: 0
          }
        });
        fail('Should not create analytics with non-existent entity ID');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create analytics with negative metrics', async () => {
      try {
        await Analytics.create({
          entityType: 'user',
          entityId: testUser._id,
          date: new Date(),
          metrics: {
            views: -1,
            uniqueViews: 0,
            interactions: 0
          }
        });
        fail('Should not create analytics with negative metrics');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Analytics Methods', () => {
    it('should update metrics', async () => {
      await testAnalytics.updateMetrics({
        views: 150,
        uniqueViews: 75
      });

      expect(testAnalytics.metrics.views).toBe(150);
      expect(testAnalytics.metrics.uniqueViews).toBe(75);
    });

    it('should update demographics', async () => {
      await testAnalytics.updateDemographics({
        ageGroups: { '18-24': 40, '25-34': 30 },
        gender: { male: 50, female: 20 }
      });

      expect(testAnalytics.metrics.demographics.ageGroups['18-24']).toBe(40);
      expect(testAnalytics.metrics.demographics.gender.male).toBe(50);
    });

    it('should update location data', async () => {
      await testAnalytics.updateLocationData('US', 'New York');
      expect(testAnalytics.metrics.locations['US']).toBe(1);
      expect(testAnalytics.metrics.locations['US-New York']).toBe(1);
    });

    it('should update peak hours', async () => {
      await testAnalytics.updatePeakHours(14);
      expect(testAnalytics.metrics.peakHours['14']).toBe(1);
    });

    // Edge cases for analytics methods
    it('should handle invalid metrics update', async () => {
      try {
        await testAnalytics.updateMetrics({
          views: 'invalid',
          uniqueViews: 75
        });
        fail('Should not update metrics with invalid values');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle invalid demographics update', async () => {
      try {
        await testAnalytics.updateDemographics({
          ageGroups: { 'invalid': 40 },
          gender: { invalid: 50 }
        });
        fail('Should not update demographics with invalid values');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle invalid location data', async () => {
      try {
        await testAnalytics.updateLocationData('', '');
        fail('Should not update location data with empty values');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle invalid peak hours', async () => {
      try {
        await testAnalytics.updatePeakHours(25);
        fail('Should not update peak hours with invalid hour');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Analytics Static Methods', () => {
    it('should get entity analytics', async () => {
      const analytics = await Analytics.getEntityAnalytics('community', testCommunity._id);
      expect(analytics.length).toBeGreaterThan(0);
      expect(analytics[0].entityType).toBe('community');
    });

    it('should get aggregated analytics', async () => {
      const analytics = await Analytics.getAggregatedAnalytics('community', {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      });
      expect(analytics).toBeDefined();
      expect(analytics.totalViews).toBeGreaterThanOrEqual(0);
    });

    it('should get trending entities', async () => {
      const trending = await Analytics.getTrendingEntities('community', 5);
      expect(trending.length).toBeGreaterThan(0);
    });

    // Edge cases for static methods
    it('should handle non-existent entity in getEntityAnalytics', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const analytics = await Analytics.getEntityAnalytics('community', nonExistentId);
      expect(analytics).toHaveLength(0);
    });

    it('should handle invalid date range in getAggregatedAnalytics', async () => {
      try {
        await Analytics.getAggregatedAnalytics('community', {
          startDate: new Date(),
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        });
        fail('Should not get aggregated analytics with invalid date range');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle invalid limit in getTrendingEntities', async () => {
      try {
        await Analytics.getTrendingEntities('community', -1);
        fail('Should not get trending entities with invalid limit');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Analytics Indexes', () => {
    it('should have compound index on entityType, entityId, and date', async () => {
      const indexes = await Analytics.collection.indexes();
      const compoundIndex = indexes.find(index => 
        index.key.entityType === 1 && 
        index.key.entityId === 1 && 
        index.key.date === 1
      );
      expect(compoundIndex).toBeDefined();
    });

    // Edge cases for indexes
    it('should handle duplicate analytics for same entity and date', async () => {
      try {
        await Analytics.create({
          entityType: 'community',
          entityId: testCommunity._id,
          date: testAnalytics.date,
          metrics: {
            views: 0,
            uniqueViews: 0,
            interactions: 0
          }
        });
        fail('Should not create duplicate analytics');
      } catch (error) {
        expect(error.code).toBe(11000);
      }
    });
  });
}); 