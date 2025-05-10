const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedContent: {
    type: {
      type: String,
      enum: ['post', 'comment', 'message', 'user', 'community'],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  reason: {
    type: String,
    enum: [
      'spam',
      'harassment',
      'hate_speech',
      'inappropriate_content',
      'violence',
      'fake_news',
      'copyright',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'video', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolution: {
    action: {
      type: String,
      enum: [
        'warning',
        'content_removal',
        'temporary_ban',
        'permanent_ban',
        'no_action'
      ]
    },
    notes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  relatedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  history: [{
    action: {
      type: String,
      enum: [
        'created',
        'status_changed',
        'priority_changed',
        'resolution_added',
        'evidence_added',
        'note_added'
      ],
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
reportSchema.index({ status: 1, priority: 1, createdAt: -1 });
reportSchema.index({ 'reportedContent.type': 1, 'reportedContent.contentId': 1 });
reportSchema.index({ reporter: 1, createdAt: -1 });

// Method to add history entry
reportSchema.methods.addHistoryEntry = async function(action, userId, details) {
  this.history.push({
    action,
    user: userId,
    details,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status
reportSchema.methods.updateStatus = async function(status, userId, notes) {
  this.status = status;
  await this.addHistoryEntry('status_changed', userId, notes);
  return this.save();
};

// Method to update priority
reportSchema.methods.updatePriority = async function(priority, userId, notes) {
  this.priority = priority;
  await this.addHistoryEntry('priority_changed', userId, notes);
  return this.save();
};

// Method to add resolution
reportSchema.methods.addResolution = async function(action, notes, resolvedBy) {
  this.resolution = {
    action,
    notes,
    resolvedBy,
    resolvedAt: new Date()
  };
  this.status = 'resolved';
  await this.addHistoryEntry('resolution_added', resolvedBy, notes);
  return this.save();
};

// Method to add evidence
reportSchema.methods.addEvidence = async function(evidence, userId) {
  this.evidence.push(evidence);
  await this.addHistoryEntry('evidence_added', userId, 'New evidence added');
  return this.save();
};

// Static method to get reports by content
reportSchema.statics.getReportsByContent = async function(contentType, contentId) {
  return this.find({
    'reportedContent.type': contentType,
    'reportedContent.contentId': contentId
  })
  .populate('reporter', 'name')
  .populate('resolution.resolvedBy', 'name')
  .sort({ createdAt: -1 });
};

// Static method to get reports by user
reportSchema.statics.getReportsByUser = async function(userId) {
  return this.find({ reporter: userId })
    .populate('reportedContent.contentId')
    .sort({ createdAt: -1 });
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 