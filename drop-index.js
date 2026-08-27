// drop-index.js
const mongoose = require("mongoose");
require("dotenv").config();

async function dropIndex() {
  try {
    // Use your actual connection string from .env
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name";
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", mongoose.connection.db.databaseName);

    const collection = mongoose.connection.db.collection("journals");

    // Check if collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((c) => c.name);
    console.log("📊 Collections:", collectionNames);

    if (!collectionNames.includes("journals")) {
      console.log(
        'ℹ️ "journals" collection does not exist yet. No index to drop.',
      );
      await mongoose.connection.close();
      process.exit(0);
    }

    // Check if index exists
    const indexes = await collection.indexes();
    console.log(
      "📊 Current indexes:",
      indexes.map((idx) => idx.name),
    );

    const slugIndex = indexes.find((idx) => idx.name === "slug_1");

    if (slugIndex) {
      await collection.dropIndex("slug_1");
      console.log("✅ Successfully dropped slug_1 index");
    } else {
      console.log("ℹ️ slug_1 index does not exist");
    }

    await mongoose.connection.close();
    console.log("✅ Connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === 27) {
      console.log("ℹ️ Index not found, no action needed");
    }
    process.exit(0);
  }
}

dropIndex();
