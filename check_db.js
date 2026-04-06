const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');
    const User = mongoose.model('User', new mongoose.Schema({ phone: String }));
    const count = await User.countDocuments();
    console.log('User count:', count);
    const users = await User.find().limit(5);
    console.log('Recent users:', users);
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

check();
