const mongoose = require("mongoose");
const ArtistCategory = require("../modules/artistCategory/artistCategory.model");
require("dotenv").config();

const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function backfill() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected ✅");

  const categories = await ArtistCategory.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
  });

  console.log(`Found ${categories.length} categories to backfill`);

  for (const cat of categories) {
    const base = generateSlug(cat.name);
    let slug = base;
    let n = 1;

    while (await ArtistCategory.findOne({ slug, _id: { $ne: cat._id } })) {
      slug = `${base}-${n++}`;
    }

    // Use direct collection update so pre-save hook doesn't conflict
    await ArtistCategory.collection.updateOne(
      { _id: cat._id },
      { $set: { slug } },
    );

    console.log(`✔ ${cat.name} → ${slug}`);
  }

  // Sync indexes (ensures unique index on slug)
  await ArtistCategory.syncIndexes();
  console.log("Indexes synced ✅");

  await mongoose.disconnect();
  console.log("Done 🎉");
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});
