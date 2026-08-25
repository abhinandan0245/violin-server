const mongoose = require('mongoose');

async function dropIndex() {
  try {
    // Change this to your actual database name
    const uri = 'mongodb://localhost:27017/test';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('journals');
    await collection.dropIndex('slug_1');
    console.log('✅ Successfully dropped slug_1 index');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 27) {
      console.log('ℹ️ Index not found, no action needed');
    }
    process.exit(0);
  }
}

dropIndex();