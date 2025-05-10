const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['user', 'community', 'post', 'message'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entityType'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    interactions: {
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      messages: { type: Number, default: 0 }
    },
    engagement: {
      rate: { type: Number, default: 0 },
      timeSpent: { type: Number, default: 0 }, // in seconds
      bounceRate: { type: Number, default: 0 }
    },
    demographics: {
      ageGroups: {
        '13-17': { type: Number, default: 0 },
        '18-24': { type: Number, default: 0 },
        '25-34': { type: Number, default: 0 },
        '35-44': { type: Number, default: 0 },
        '45+': { type: Number, default: 0 }
      },
      gender: {
        male: { type: Number, default: 0 },
        female: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
      },
      locations: [{
        country: String,
        city: String,
        count: { type: Number, default: 0 }
      }]
    },
    devices: {
      mobile: { type: Number, default: 0 },
      desktop: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    },
    sources: {
      direct: { type: Number, default: 0 },
      search: { type: Number, default: 0 },
      referral: { type: Number, default: 0 },
      social: { type: Number, default: 0 }
    },
    peakHours: [{
      hour: Number,
      count: Number
    }],
    retention: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 }
    }
  },
  customMetrics: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
analyticsSchema.index({ entityType: 1, entityId: 1, date: 1 });

// Method to update metrics
analyticsSchema.methods.updateMetrics = async function(metricType, value = 1) {
  const metricPath = `metrics.${metricType}`;
  const currentValue = this.get(metricPath) || 0;
  this.set(metricPath, currentValue + value);
  return this.save();
};

// Method to update demographics
analyticsSchema.methods.updateDemographics = async function(demographicType, value) {
  const demoPath = `metrics.demographics.${demographicType}`;
  const currentValue = this.get(demoPath) || 0;
  this.set(demoPath, currentValue + value);
  return this.save();
};

// Method to update location data
analyticsSchema.methods.updateLocation = async function(country, city) {
  const location = this.metrics.demographics.locations.find(
    loc => loc.country === country && loc.city === city
  );

  if (location) {
    location.count += 1;
  } else {
    this.metrics.demographics.locations.push({
      country,
      city,
      count: 1
    });
  }

  return this.save();
};

// Method to update peak hours
analyticsSchema.methods.updatePeakHours = async function(hour) {
  const peakHour = this.metrics.peakHours.find(ph => ph.hour === hour);
  
  if (peakHour) {
    peakHour.count += 1;
  } else {
    this.metrics.peakHours.push({
      hour,
      count: 1
    });
  }

  return this.save();
};

// Static method to get analytics for an entity
analyticsSchema.statics.getEntityAnalytics = async function(entityType, entityId, startDate, endDate) {
  const query = {
    entityType,
    entityId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return this.find(query)
    .sort({ date: 1 })
    .select('-customMetrics');
};

// Static method to get aggregated analytics
analyticsSchema.statics.getAggregatedAnalytics = async function(entityType, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        entityType,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: '$metrics.views' },
        totalInteractions: {
          $sum: {
            $add: [
              '$metrics.interactions.likes',
              '$metrics.interactions.comments',
              '$metrics.interactions.shares'
            ]
          }
        },
        averageEngagement: { $avg: '$metrics.engagement.rate' },
        totalUsers: { $addToSet: '$entityId' }
      }
    }
  ]);
};

// Static method to get trending entities
analyticsSchema.statics.getTrendingEntities = async function(entityType, limit = 10) {
  return this.aggregate([
    {
      $match: {
        entityType,
        date: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    },
    {
      $group: {
        _id: '$entityId',
        totalViews: { $sum: '$metrics.views' },
        totalInteractions: {
          $sum: {
            $add: [
              '$metrics.interactions.likes',
              '$metrics.interactions.comments',
              '$metrics.interactions.shares'
            ]
          }
        }
      }
    },
    {
      $sort: {
        totalInteractions: -1
      }
    },
    {
      $limit: limit
    }
  ]);
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics; 