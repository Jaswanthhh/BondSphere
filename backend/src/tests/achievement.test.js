const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

describe('Achievement Model Test', () => {
  let testUser;
  let testAchievement;

  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create a test achievement
    testAchievement = await Achievement.create({
      name: 'Test Achievement',
      description: 'Test achievement description',
      type: 'social',
      category: 'friends',
      icon: '🎯',
      points: 50,
      requirements: {
        type: 'count',
        target: 5,
        conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
      },
      rarity: 'uncommon',
      metadata: {
        displayOrder: 1,
        color: '#FF0000'
      }
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Achievement Creation', () => {
    it('should create a new achievement successfully', async () => {
      const achievement = await Achievement.create({
        name: 'New Achievement',
        description: 'New achievement description',
        type: 'content',
        category: 'posts',
        icon: '📝',
        points: 100,
        requirements: {
          type: 'count',
          target: 10,
          conditions: [{ type: 'posts', value: 10, operator: 'equals' }]
        },
        rarity: 'rare',
        metadata: {
          displayOrder: 2,
          color: '#00FF00'
        }
      });

      expect(achievement.name).toBe('New Achievement');
      expect(achievement.type).toBe('content');
      expect(achievement.points).toBe(100);
      expect(achievement.rarity).toBe('rare');
    });

    it('should not create achievement with duplicate name', async () => {
      try {
        await Achievement.create({
          name: 'Test Achievement',
          description: 'Duplicate achievement',
          type: 'social',
          category: 'friends',
          icon: '🎯',
          points: 50,
          requirements: {
            type: 'count',
            target: 5,
            conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
          }
        });
        fail('Should not create duplicate achievement');
      } catch (error) {
        expect(error.code).toBe(11000);
      }
    });

    // Edge cases for achievement creation
    it('should not create achievement with invalid type', async () => {
      try {
        await Achievement.create({
          name: 'Invalid Type Achievement',
          description: 'Test description',
          type: 'invalid_type',
          category: 'friends',
          icon: '🎯',
          points: 50,
          requirements: {
            type: 'count',
            target: 5,
            conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
          }
        });
        fail('Should not create achievement with invalid type');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create achievement with negative points', async () => {
      try {
        await Achievement.create({
          name: 'Negative Points Achievement',
          description: 'Test description',
          type: 'social',
          category: 'friends',
          icon: '🎯',
          points: -50,
          requirements: {
            type: 'count',
            target: 5,
            conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
          }
        });
        fail('Should not create achievement with negative points');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should not create achievement with invalid rarity', async () => {
      try {
        await Achievement.create({
          name: 'Invalid Rarity Achievement',
          description: 'Test description',
          type: 'social',
          category: 'friends',
          icon: '🎯',
          points: 50,
          requirements: {
            type: 'count',
            target: 5,
            conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
          },
          rarity: 'invalid_rarity'
        });
        fail('Should not create achievement with invalid rarity');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });
  });

  describe('Achievement Methods', () => {
    it('should check if user has earned achievement', () => {
      const hasEarned = testAchievement.hasEarned(testUser._id);
      expect(hasEarned).toBe(false);
    });

    it('should get user progress', () => {
      const progress = testAchievement.getUserProgress(testUser._id);
      expect(progress).toBe(0);
    });

    it('should update user progress', async () => {
      await testAchievement.updateProgress(testUser._id, 3);
      const progress = testAchievement.getUserProgress(testUser._id);
      expect(progress).toBe(3);
    });

    it('should award achievement to user', async () => {
      await testAchievement.award(testUser._id);
      const hasEarned = testAchievement.hasEarned(testUser._id);
      expect(hasEarned).toBe(true);
    });

    it('should not award achievement twice to same user', async () => {
      try {
        await testAchievement.award(testUser._id);
        fail('Should not award achievement twice');
      } catch (error) {
        expect(error.message).toBe('User has already earned this achievement');
      }
    });

    // Edge cases for achievement methods
    it('should handle non-existent user ID in hasEarned', () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const hasEarned = testAchievement.hasEarned(nonExistentId);
      expect(hasEarned).toBe(false);
    });

    it('should handle non-existent user ID in getUserProgress', () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const progress = testAchievement.getUserProgress(nonExistentId);
      expect(progress).toBe(0);
    });

    it('should handle invalid progress value in updateProgress', async () => {
      try {
        await testAchievement.updateProgress(testUser._id, -1);
        fail('Should not update progress with negative value');
      } catch (error) {
        expect(error.name).toBe('ValidationError');
      }
    });

    it('should handle progress exceeding target', async () => {
      await testAchievement.updateProgress(testUser._id, 10);
      const progress = testAchievement.getUserProgress(testUser._id);
      expect(progress).toBe(10);
      // Should not throw error, but should be noted that progress exceeds target
    });
  });

  describe('Achievement Static Methods', () => {
    it('should get achievements by type', async () => {
      const achievements = await Achievement.getByType('social');
      expect(achievements.length).toBeGreaterThan(0);
      expect(achievements[0].type).toBe('social');
    });

    it('should get user achievements', async () => {
      const achievements = await Achievement.getUserAchievements(testUser._id);
      expect(achievements.length).toBeGreaterThan(0);
    });

    it('should get available achievements', async () => {
      const achievements = await Achievement.getAvailableAchievements(testUser._id);
      expect(achievements.length).toBeGreaterThan(0);
    });

    // Edge cases for static methods
    it('should handle non-existent user ID in getUserAchievements', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const achievements = await Achievement.getUserAchievements(nonExistentId);
      expect(achievements).toHaveLength(0);
    });

    it('should handle non-existent user ID in getAvailableAchievements', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const achievements = await Achievement.getAvailableAchievements(nonExistentId);
      expect(achievements.length).toBeGreaterThan(0);
    });

    it('should handle invalid type in getByType', async () => {
      const achievements = await Achievement.getByType('invalid_type');
      expect(achievements).toHaveLength(0);
    });
  });

  describe('Achievement Virtuals', () => {
    it('should calculate completion percentage', () => {
      const percentage = testAchievement.completionPercentage;
      expect(percentage).toBe(20); // 1 user out of 5 target
    });

    // Edge cases for virtuals
    it('should handle zero target in completion percentage', async () => {
      const zeroTargetAchievement = await Achievement.create({
        name: 'Zero Target Achievement',
        description: 'Test description',
        type: 'social',
        category: 'friends',
        icon: '🎯',
        points: 50,
        requirements: {
          type: 'count',
          target: 0,
          conditions: [{ type: 'friends', value: 0, operator: 'equals' }]
        }
      });
      expect(zeroTargetAchievement.completionPercentage).toBe(0);
    });

    it('should handle empty earnedBy array in completion percentage', async () => {
      const emptyEarnedAchievement = await Achievement.create({
        name: 'Empty Earned Achievement',
        description: 'Test description',
        type: 'social',
        category: 'friends',
        icon: '🎯',
        points: 50,
        requirements: {
          type: 'count',
          target: 5,
          conditions: [{ type: 'friends', value: 5, operator: 'equals' }]
        },
        earnedBy: []
      });
      expect(emptyEarnedAchievement.completionPercentage).toBe(0);
    });
  });
}); 