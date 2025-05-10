const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      required: true
    },
    venue: String
  },
  coverImage: {
    type: String,
    default: ''
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['going', 'maybe', 'not_going'],
      default: 'going'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxAttendees: {
    type: Number,
    min: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  reminders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    time: {
      type: Date,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ community: 1, startDate: 1 });
eventSchema.index({ location: '2dsphere' });
eventSchema.index({ tags: 1 });
eventSchema.index({ status: 1, startDate: 1 });

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.filter(a => a.status === 'going').length;
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
  if (!this.maxAttendees) return false;
  return this.attendeeCount >= this.maxAttendees;
};

// Method to add attendee
eventSchema.methods.addAttendee = async function(userId, status = 'going') {
  if (this.isFull() && status === 'going') {
    throw new Error('Event is full');
  }

  const attendeeIndex = this.attendees.findIndex(
    a => a.user.toString() === userId.toString()
  );

  if (attendeeIndex === -1) {
    this.attendees.push({ user: userId, status });
  } else {
    this.attendees[attendeeIndex].status = status;
  }

  return this.save();
};

// Method to remove attendee
eventSchema.methods.removeAttendee = async function(userId) {
  this.attendees = this.attendees.filter(
    a => a.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to add reminder
eventSchema.methods.addReminder = async function(userId, time) {
  const reminderIndex = this.reminders.findIndex(
    r => r.user.toString() === userId.toString()
  );

  if (reminderIndex === -1) {
    this.reminders.push({ user: userId, time });
  } else {
    this.reminders[reminderIndex].time = time;
  }

  return this.save();
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 