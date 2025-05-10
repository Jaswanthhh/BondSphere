const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'social',
      'community',
      'content',
      'engagement',
      'special'
    ],
    required: true
  },
  category: {
    type: String,
    enum: [
      'friends',
      'posts',
      'comments',
      'events',
      'polls',
      'communities',
      'messages',
      'reports',
      'moderation'
    ],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  requirements: {
    type: {
      type: String,
      enum: [
        'count',
        'streak',
        'unique',
        'combination',
        'special'
      ],
      required: true
    },
    target: {
      type: Number,
      required: true,
      min: 1
    },
    timeframe: {
      type: Number, // in days, 0 for lifetime
      default: 0
    },
    conditions: [{
      type: {
        type: String,
        required: true
      },
      value: mongoose.Schema.Types.Mixed,
      operator: {
        type: String,
        enum: ['equals', 'greater_than', 'less_than', 'contains'],
        default: 'equals'
      }
    }]
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  earnedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  metadata: {
    displayOrder: {
      type: Number,
      default: 0
    },
    color: String,
    animation: String,
    sound: String
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ type: 1, category: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ isActive: 1, endDate: 1 });
achievementSchema.index({ 'earnedBy.user': 1 });

// Virtual for completion percentage
achievementSchema.virtual('completionPercentage').get(function() {
  if (!this.earnedBy.length) return 0;
  return (this.earnedBy.length / this.requirements.target) * 100;
});

// Method to check if user has earned achievement
achievementSchema.methods.hasEarned = function(userId) {
  return this.earnedBy.some(earn => earn.user.toString() === userId.toString());
};

// Method to get user's progress
achievementSchema.methods.getUserProgress = function(userId) {
  const earned = this.earnedBy.find(earn => earn.user.toString() === userId.toString());
  return earned ? earned.progress : 0;
};

// Method to update user's progress
achievementSchema.methods.updateProgress = async function(userId, progress) {
  const earnedIndex = this.earnedBy.findIndex(
    earn => earn.user.toString() === userId.toString()
  );

  if (earnedIndex === -1) {
    this.earnedBy.push({
      user: userId,
      progress
    });
  } else {
    this.earnedBy[earnedIndex].progress = progress;
  }

  return this.save();
};

// Method to award achievement
achievementSchema.methods.award = async function(userId) {
  if (this.hasEarned(userId)) {
    throw new Error('User has already earned this achievement');
  }

  this.earnedBy.push({
    user: userId,
    progress: this.requirements.target
  });

  return this.save();
};

// Static method to get achievements by type
achievementSchema.statics.getByType = async function(type, category = null) {
  const query = { type, isActive: true };
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ 'metadata.displayOrder': 1 })
    .select('-earnedBy');
};

// Static method to get user's achievements
achievementSchema.statics.getUserAchievements = async function(userId) {
  return this.find({
    'earnedBy.user': userId,
    isActive: true
  })
  .sort({ 'metadata.displayOrder': 1 })
  .select('-earnedBy');
};

// Static method to get available achievements
achievementSchema.statics.getAvailableAchievements = async function(userId) {
  return this.find({
    isActive: true,
    'earnedBy.user': { $ne: userId }
  })
  .sort({ 'metadata.displayOrder': 1 })
  .select('-earnedBy');
};

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement; 