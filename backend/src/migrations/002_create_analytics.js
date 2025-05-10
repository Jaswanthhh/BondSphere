const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');

async function up() {
  try {
    // Create indexes for analytics
    await Analytics.createIndexes();
    
    // Create initial analytics records for existing entities
    const User = mongoose.model('User');
    const Community = mongoose.model('Community');
    const Post = mongoose.model('Post');
    const Message = mongoose.model('Message');

    // Get all existing entities
    const users = await User.find({});
    const communities = await Community.find({});
    const posts = await Post.find({});
    const messages = await Message.find({});

    // Create analytics records for users
    const userAnalytics = users.map(user => ({
      entityType: 'user',
      entityId: user._id,
      date: new Date(),
      metrics: {
        views: 0,
        uniqueViews: 0,
        interactions: {
          likes: 0,
          comments: 0,
          shares: 0,
          messages: 0
        },
        engagement: {
          rate: 0,
          timeSpent: 0,
          bounceRate: 0
        }
      }
    }));

    // Create analytics records for communities
    const communityAnalytics = communities.map(community => ({
      entityType: 'community',
      entityId: community._id,
      date: new Date(),
      metrics: {
        views: 0,
        uniqueViews: 0,
        interactions: {
          likes: 0,
          comments: 0,
          shares: 0,
          messages: 0
        },
        engagement: {
          rate: 0,
          timeSpent: 0,
          bounceRate: 0
        }
      }
    }));

    // Create analytics records for posts
    const postAnalytics = posts.map(post => ({
      entityType: 'post',
      entityId: post._id,
      date: new Date(),
      metrics: {
        views: 0,
        uniqueViews: 0,
        interactions: {
          likes: 0,
          comments: 0,
          shares: 0,
          messages: 0
        },
        engagement: {
          rate: 0,
          timeSpent: 0,
          bounceRate: 0
        }
      }
    }));

    // Create analytics records for messages
    const messageAnalytics = messages.map(message => ({
      entityType: 'message',
      entityId: message._id,
      date: new Date(),
      metrics: {
        views: 0,
        uniqueViews: 0,
        interactions: {
          likes: 0,
          comments: 0,
          shares: 0,
          messages: 0
        },
        engagement: {
          rate: 0,
          timeSpent: 0,
          bounceRate: 0
        }
      }
    }));

    // Insert all analytics records
    await Analytics.insertMany([
      ...userAnalytics,
      ...communityAnalytics,
      ...postAnalytics,
      ...messageAnalytics
    ]);

    console.log('✅ Analytics migration completed');
  } catch (error) {
    console.error('❌ Analytics migration failed:', error);
    throw error;
  }
}

async function down() {
  try {
    await Analytics.deleteMany({});
    console.log('✅ Analytics rollback completed');
  } catch (error) {
    console.error('❌ Analytics rollback failed:', error);
    throw error;
  }
}

module.exports = { up, down }; 