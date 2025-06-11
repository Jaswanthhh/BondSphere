const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

async function fixUserNames() {
  await connectDB();
  const result = await User.updateMany(
    { $or: [ { name: { $exists: false } }, { name: '' }, { avatar: { $exists: false } }, { avatar: '' } ] },
    { $set: { name: 'User', avatar: '/default-avatar.png' } }
  );
  console.log('Users updated:', result.modifiedCount || result.nModified || result);
  process.exit(0);
}

fixUserNames(); 