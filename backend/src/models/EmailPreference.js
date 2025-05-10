const mongoose = require('mongoose');

const emailPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferences: {
    notifications: {
      comments: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    community: {
      invites: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true }
    },
    marketing: {
      newsletters: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false },
      updates: { type: Boolean, default: true }
    }
  },
  frequency: {
    type: String,
    enum: ['immediate', 'daily', 'weekly'],
    default: 'immediate'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for quick user lookup
emailPreferenceSchema.index({ user: 1 });

// Method to check if user should receive a specific type of email
emailPreferenceSchema.methods.shouldReceiveEmail = function(type, category) {
  if (!this.preferences[category]) return false;
  return this.preferences[category][type] !== false;
};

// Method to update preferences
emailPreferenceSchema.methods.updatePreferences = function(updates) {
  Object.keys(updates).forEach(category => {
    if (this.preferences[category]) {
      Object.keys(updates[category]).forEach(pref => {
        if (typeof updates[category][pref] === 'boolean') {
          this.preferences[category][pref] = updates[category][pref];
        }
      });
    }
  });
  this.lastUpdated = new Date();
  return this.save();
};

// Static method to get or create preferences for a user
emailPreferenceSchema.statics.getOrCreate = async function(userId) {
  let preferences = await this.findOne({ user: userId });
  if (!preferences) {
    preferences = await this.create({ user: userId });
  }
  return preferences;
};

const EmailPreference = mongoose.model('EmailPreference', emailPreferenceSchema);

module.exports = EmailPreference; 