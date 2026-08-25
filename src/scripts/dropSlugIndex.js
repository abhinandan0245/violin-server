# Create the file with content using PowerShell
@"
const mongoose = require('mongoose');
require('dotenv').config();

async function dropSlugIndex() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('journals');

    const indexes = await collection.indexes();
    console.log('📊 Current indexes:', indexes.map(idx => idx.name));

    const slugIndex = indexes.find(idx => idx.name === 'slug_1');

    if (slugIndex) {
      await collection.dropIndex('slug_1');
      console.log('✅ Successfully dropped slug_1 index');
    } else {
      console.log('ℹ️ slug_1 index does not exist');
    }

    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.code === 27) {
      console.log('ℹ️ Index not found, no action needed');
      process.exit(0);
    }
    process.exit(1);
  }
}

dropSlugIndex();
"@ | Out-File -FilePath scripts/dropSlugIndex.js -Encoding utf8