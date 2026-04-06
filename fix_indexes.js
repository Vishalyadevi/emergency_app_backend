const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency_neighbour';

async function fix() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Get the User collection
    const User = mongoose.connection.collection('users');

    // Drop the problematic email_1 index
    console.log('Attempting to drop email_1 index...');
    await User.dropIndex('email_1');
    console.log('✅ Successfully dropped email_1 index!');

  } catch (err) {
    if (err.codeName === 'IndexNotFound') {
      console.log('Index was already removed.');
    } else {
      console.error('Error:', err.message);
    }
  } finally {
    mongoose.connection.close();
  }
}

fix();
