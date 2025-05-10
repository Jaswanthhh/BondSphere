const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
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
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    votes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  settings: {
    isMultipleChoice: {
      type: Boolean,
      default: false
    },
    maxChoices: {
      type: Number,
      min: 1,
      default: 1
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: true
    },
    allowComments: {
      type: Boolean,
      default: true
    }
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'cancelled'],
    default: 'active'
  },
  tags: [{
    type: String,
    trim: true
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
  }],
  voters: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
pollSchema.index({ community: 1, createdAt: -1 });
pollSchema.index({ status: 1, endDate: 1 });
pollSchema.index({ tags: 1 });

// Virtual for total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((total, option) => total + option.votes.length, 0);
});

// Method to check if user has voted
pollSchema.methods.hasVoted = function(userId) {
  return this.voters.some(voter => voter.user.toString() === userId.toString());
};

// Method to add vote
pollSchema.methods.addVote = async function(userId, optionIndexes) {
  if (this.status !== 'active') {
    throw new Error('Poll is not active');
  }

  if (this.hasVoted(userId)) {
    throw new Error('User has already voted');
  }

  if (!this.settings.isMultipleChoice && optionIndexes.length > 1) {
    throw new Error('Multiple choice not allowed');
  }

  if (optionIndexes.length > this.settings.maxChoices) {
    throw new Error(`Maximum ${this.settings.maxChoices} choices allowed`);
  }

  // Add votes to options
  optionIndexes.forEach(index => {
    if (index >= 0 && index < this.options.length) {
      this.options[index].votes.push({ user: userId });
    }
  });

  // Add to voters list
  this.voters.push({ user: userId });

  // Check if poll should end
  if (new Date() >= this.endDate) {
    this.status = 'ended';
  }

  return this.save();
};

// Method to remove vote
pollSchema.methods.removeVote = async function(userId) {
  if (this.status !== 'active') {
    throw new Error('Poll is not active');
  }

  // Remove votes from options
  this.options.forEach(option => {
    option.votes = option.votes.filter(
      vote => vote.user.toString() !== userId.toString()
    );
  });

  // Remove from voters list
  this.voters = this.voters.filter(
    voter => voter.user.toString() !== userId.toString()
  );

  return this.save();
};

// Method to get results
pollSchema.methods.getResults = function() {
  if (!this.settings.showResults && this.status === 'active') {
    throw new Error('Results are hidden while poll is active');
  }

  return this.options.map(option => ({
    text: option.text,
    votes: option.votes.length,
    percentage: this.totalVotes > 0 
      ? (option.votes.length / this.totalVotes) * 100 
      : 0
  }));
};

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll; 