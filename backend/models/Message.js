const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  media: { 
    type: String // URL for media files (images, videos, etc.)
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Message', MessageSchema); 