// src/scripts/backfill-slugs.js
const path = require("path");
const fs = require("fs");

// Look in the ROOT directory (2 levels up from src/scripts)
const rootEnvPath = path.resolve(__dirname, "../../.env");
const srcEnvPath = path.resolve(__dirname, "../.env");

// Check where the .env actually is and load it manually to avoid dotenvx issues
if (fs.existsSync(rootEnvPath)) {
  console.log("✅ Found .env in ROOT directory. Loading it...");
  require("dotenv").config({ path: rootEnvPath, override: true });
} else if (fs.existsSync(srcEnvPath)) {
  console.log("✅ Found .env in SRC directory. Loading it...");
  require("dotenv").config({ path: srcEnvPath, override: true });
} else {
  console.log("❌ Could not find .env in root OR src folder.");
}

const mongoose = require("mongoose");
const Destination = require("../modules/destination/destination.model");

async function run() {
  // Check all possible variable names your project might use
  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    process.env.DB_URI ||
    process.env.MONGO_URL;

  if (!uri) {
    console.error("\n❌ NO DATABASE URI FOUND IN .env FILE!");
    console.log("Here are the variables the script CAN see:");
    // Print the keys of the environment variables (hiding passwords)
    console.log(Object.keys(process.env).filter((k) => !k.includes("npm_")));
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const docs = await Destination.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
  });

  console.log(`🔍 Found ${docs.length} destinations missing slug`);

  let updated = 0;
  for (const doc of docs) {
    try {
      doc.slug = await Destination.generateUniqueSlug({
        city: doc.city,
        state: doc.state,
        country: doc.country,
      });
      await doc.save();
      updated++;
      console.log(`✅ ${doc._id} -> ${doc.slug}`);
    } catch (err) {
      console.error(`❌ Failed for ${doc._id}:`, err.message);
    }
  }

  console.log(`\n🎉 Done. Updated ${updated}/${docs.length}`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Script error:", e);
  process.exit(1);
});
