// drop-index-safe.js
const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndexSafely() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.db.databaseName);

    const db = mongoose.connection.db;
    
    // Check all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('📊 Collections:', collectionNames);

    // Check if journals collection exists
    if (!collectionNames.includes('journals')) {
      console.log('ℹ️ "journals" collection does not exist. No action needed.');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Collection exists, try to drop the index
    const collection = db.collection('journals');
    const indexes = await collection.indexes();
    console.log('📊 Current indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));

    const slugIndex = indexes.find(idx => idx.name === 'slug_1');

    if (slugIndex) {
      await collection.dropIndex('slug_1');
      console.log('✅ Successfully dropped slug_1 index');
    } else {
      console.log('ℹ️ slug_1 index does not exist in the collection');
    }

    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 26) {
      console.log('ℹ️ Collection not found, no action needed');
    }
    process.exit(0);
  }
}

dropIndexSafely();