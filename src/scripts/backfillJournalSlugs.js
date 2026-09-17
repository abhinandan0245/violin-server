// src/scripts/backfillJournalSlugs.js
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");
const Journal = require("../modules/journal/journal.model");

async function backfillSlugs() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const items = await Journal.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
  });

  console.log(`📦 Found ${items.length} items without slugs`);

  for (const item of items) {
    if (!item.title) {
      console.log(`⚠️  Skipping item ${item._id} (no title)`);
      continue;
    }

    let baseSlug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await Journal.findOne({ slug, _id: { $ne: item._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Use updateOne to bypass the pre-save hook resetting slug
    await Journal.updateOne({ _id: item._id }, { $set: { slug } });
    console.log(`✅ ${item.title} → ${slug}`);
  }

  console.log("🎉 Done!");
  await mongoose.disconnect();
}

backfillSlugs().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
