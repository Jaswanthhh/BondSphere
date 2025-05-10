const mongoose = require('mongoose');
const Notification = require('../models/Notification');

async function up() {
  try {
    // Create indexes for notifications
    await Notification.createIndexes();

    // Create initial notification templates
    const templates = [
      {
        type: 'friend_request',
        content: '{{sender}} sent you a friend request',
        priority: 'medium',
        channels: ['in_app', 'email']
      },
      {
        type: 'friend_accepted',
        content: '{{sender}} accepted your friend request',
        priority: 'low',
        channels: ['in_app']
      },
      {
        type: 'message',
        content: 'New message from {{sender}}',
        priority: 'high',
        channels: ['in_app', 'push', 'email']
      },
      {
        type: 'post_mention',
        content: '{{sender}} mentioned you in a post',
        priority: 'medium',
        channels: ['in_app', 'push']
      },
      {
        type: 'comment_mention',
        content: '{{sender}} mentioned you in a comment',
        priority: 'medium',
        channels: ['in_app', 'push']
      },
      {
        type: 'post_like',
        content: '{{sender}} liked your post',
        priority: 'low',
        channels: ['in_app']
      },
      {
        type: 'comment_like',
        content: '{{sender}} liked your comment',
        priority: 'low',
        channels: ['in_app']
      },
      {
        type: 'event_invite',
        content: '{{sender}} invited you to an event',
        priority: 'high',
        channels: ['in_app', 'push', 'email']
      },
      {
        type: 'event_reminder',
        content: 'Reminder: Event starting soon',
        priority: 'high',
        channels: ['in_app', 'push', 'email']
      },
      {
        type: 'poll_created',
        content: 'New poll created in {{community}}',
        priority: 'medium',
        channels: ['in_app', 'push']
      },
      {
        type: 'poll_ended',
        content: 'Poll results are now available',
        priority: 'low',
        channels: ['in_app']
      },
      {
        type: 'community_invite',
        content: '{{sender}} invited you to join {{community}}',
        priority: 'high',
        channels: ['in_app', 'push', 'email']
      },
      {
        type: 'community_role_change',
        content: 'Your role in {{community}} has been updated',
        priority: 'medium',
        channels: ['in_app', 'email']
      },
      {
        type: 'report_status',
        content: 'Update on your report: {{status}}',
        priority: 'medium',
        channels: ['in_app', 'email']
      },
      {
        type: 'achievement_earned',
        content: 'Congratulations! You earned the {{achievement}} achievement',
        priority: 'high',
        channels: ['in_app', 'push']
      }
    ];

    // Store templates in a separate collection for future use
    await mongoose.connection.collection('notification_templates').insertMany(templates);

    console.log('✅ Notifications migration completed');
  } catch (error) {
    console.error('❌ Notifications migration failed:', error);
    throw error;
  }
}

async function down() {
  try {
    await Notification.deleteMany({});
    await mongoose.connection.collection('notification_templates').drop();
    console.log('✅ Notifications rollback completed');
  } catch (error) {
    console.error('❌ Notifications rollback failed:', error);
    throw error;
  }
}

module.exports = { up, down }; 