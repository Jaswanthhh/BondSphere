const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'friend_request',
      'friend_accepted',
      'message',
      'post_mention',
      'comment_mention',
      'post_like',
      'comment_like',
      'event_invite',
      'event_reminder',
      'poll_created',
      'poll_ended',
      'community_invite',
      'community_role_change',
      'report_status',
      'achievement_earned'
    ],
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    // Flexible object to store additional data based on notification type
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    commentId: { type: mongoose.Schema.Types.ObjectId },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionTaken: {
    type: Boolean,
    default: false
  },
  actionTakenAt: Date,
  expiresAt: Date,
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  lastDeliveryAttempt: Date,
  channels: [{
    type: {
      type: String,
      enum: ['in_app', 'email', 'push', 'sms'],
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    error: String
  }]
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ type: 1, 'data.postId': 1 });
notificationSchema.index({ type: 1, 'data.eventId': 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    return this.save();
  }
  return this;
};

// Method to mark action taken
notificationSchema.methods.markActionTaken = async function() {
  if (!this.actionTaken) {
    this.actionTaken = true;
    this.actionTakenAt = new Date();
    return this.save();
  }
  return this;
};

// Method to record delivery attempt
notificationSchema.methods.recordDeliveryAttempt = async function(channel, error = null) {
  const channelIndex = this.channels.findIndex(c => c.type === channel);
  
  if (channelIndex === -1) {
    this.channels.push({
      type: channel,
      sent: !error,
      sentAt: new Date(),
      error
    });
  } else {
    this.channels[channelIndex] = {
      ...this.channels[channelIndex],
      sent: !error,
      sentAt: new Date(),
      error
    };
  }

  this.deliveryAttempts += 1;
  this.lastDeliveryAttempt = new Date();
  return this.save();
};

// Static method to get unread notifications
notificationSchema.statics.getUnreadNotifications = async function(userId, limit = 20) {
  return this.find({
    recipient: userId,
    read: false,
    expiresAt: { $gt: new Date() }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'name avatar');
};

// Static method to get notifications by type
notificationSchema.statics.getNotificationsByType = async function(userId, type, limit = 20) {
  return this.find({
    recipient: userId,
    type,
    expiresAt: { $gt: new Date() }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('sender', 'name avatar');
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this({
    ...data,
    expiresAt: data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
  });
  return notification.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 