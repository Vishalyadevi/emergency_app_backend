const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fix() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');
    
    // Attempt to drop the 'username' index if it exists
    try {
      await mongoose.connection.collection('users').dropIndex('username_1');
      console.log('✅ Dropped index username_1');
    } catch (e) {
      console.log('⚠️ Index username_1 could not be dropped (maybe it does not exist anymore or name is different)');
      // List indices to find the right one
      const indexes = await mongoose.connection.collection('users').indexes();
      console.log('Available indexes:', indexes);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

fix();
