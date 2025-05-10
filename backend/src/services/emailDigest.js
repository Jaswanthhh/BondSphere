const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const EmailPreference = require('../models/EmailPreference');
const emailQueue = require('./emailQueue');
const logger = require('../utils/logger');

// Generate daily digest for a user
const generateDailyDigest = async (userId) => {
  try {
    const user = await User.findById(userId);
    const preferences = await EmailPreference.findOne({ user: userId });
    
    if (!user || !preferences) return null;

    // Get date range for the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Get user's notifications
    const notifications = await Notification.find({
      recipient: userId,
      createdAt: { $gte: yesterday },
      read: false
    }).sort({ createdAt: -1 });

    // Get popular posts from user's communities
    const popularPosts = await Post.find({
      community: { $in: user.communities },
      createdAt: { $gte: yesterday }
    })
    .sort({ likes: -1 })
    .limit(5)
    .populate('author', 'name')
    .populate('community', 'name');

    // Get user's activity
    const userActivity = await Promise.all([
      Post.countDocuments({ author: userId, createdAt: { $gte: yesterday } }),
      Comment.countDocuments({ author: userId, createdAt: { $gte: yesterday } }),
      Notification.countDocuments({ recipient: userId, createdAt: { $gte: yesterday } })
    ]);

    // Generate digest content
    const digest = {
      user: {
        name: user.name,
        email: user.email
      },
      notifications: notifications.map(n => ({
        type: n.type,
        message: n.message,
        createdAt: n.createdAt
      })),
      popularPosts: popularPosts.map(p => ({
        title: p.title,
        author: p.author.name,
        community: p.community.name,
        likes: p.likes,
        comments: p.comments.length
      })),
      activity: {
        posts: userActivity[0],
        comments: userActivity[1],
        notifications: userActivity[2]
      }
    };

    return digest;
  } catch (error) {
    logger.error('Error generating daily digest:', error);
    return null;
  }
};

// Generate weekly digest for a user
const generateWeeklyDigest = async (userId) => {
  try {
    const user = await User.findById(userId);
    const preferences = await EmailPreference.findOne({ user: userId });
    
    if (!user || !preferences) return null;

    // Get date range for the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Get user's notifications
    const notifications = await Notification.find({
      recipient: userId,
      createdAt: { $gte: lastWeek }
    }).sort({ createdAt: -1 });

    // Get popular posts from user's communities
    const popularPosts = await Post.find({
      community: { $in: user.communities },
      createdAt: { $gte: lastWeek }
    })
    .sort({ likes: -1 })
    .limit(10)
    .populate('author', 'name')
    .populate('community', 'name');

    // Get user's activity summary
    const userActivity = await Promise.all([
      Post.countDocuments({ author: userId, createdAt: { $gte: lastWeek } }),
      Comment.countDocuments({ author: userId, createdAt: { $gte: lastWeek } }),
      Notification.countDocuments({ recipient: userId, createdAt: { $gte: lastWeek } })
    ]);

    // Get community growth
    const communityGrowth = await Promise.all(
      user.communities.map(async (communityId) => {
        const community = await Community.findById(communityId);
        const newMembers = await User.countDocuments({
          communities: communityId,
          createdAt: { $gte: lastWeek }
        });
        return {
          name: community.name,
          newMembers,
          totalMembers: community.members.length
        };
      })
    );

    // Generate digest content
    const digest = {
      user: {
        name: user.name,
        email: user.email
      },
      notifications: notifications.map(n => ({
        type: n.type,
        message: n.message,
        createdAt: n.createdAt
      })),
      popularPosts: popularPosts.map(p => ({
        title: p.title,
        author: p.author.name,
        community: p.community.name,
        likes: p.likes,
        comments: p.comments.length
      })),
      activity: {
        posts: userActivity[0],
        comments: userActivity[1],
        notifications: userActivity[2]
      },
      communityGrowth
    };

    return digest;
  } catch (error) {
    logger.error('Error generating weekly digest:', error);
    return null;
  }
};

// Send digest emails
const sendDigestEmails = async () => {
  try {
    // Get users with digest preferences
    const users = await User.find({
      'emailPreferences.frequency': { $in: ['daily', 'weekly'] }
    });

    for (const user of users) {
      const preferences = await EmailPreference.findOne({ user: user._id });
      
      if (!preferences) continue;

      let digest;
      let template;
      let subject;

      if (preferences.frequency === 'daily') {
        digest = await generateDailyDigest(user._id);
        template = 'daily-digest';
        subject = 'Your Daily BondSphere Digest';
      } else if (preferences.frequency === 'weekly') {
        digest = await generateWeeklyDigest(user._id);
        template = 'weekly-digest';
        subject = 'Your Weekly BondSphere Digest';
      }

      if (digest) {
        await emailQueue.queueEmail({
          to: user.email,
          subject,
          template,
          data: digest
        });
      }
    }
  } catch (error) {
    logger.error('Error sending digest emails:', error);
  }
};

// Schedule digest emails
const scheduleDigestEmails = () => {
  // Send daily digests at 8 AM
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      sendDigestEmails();
    }
  }, 60000); // Check every minute
};

module.exports = {
  generateDailyDigest,
  generateWeeklyDigest,
  sendDigestEmails,
  scheduleDigestEmails
}; 