const mongoose = require("mongoose");
const Artist = require("../modules/artist/artist.model");
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

  const artists = await Artist.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
  });

  console.log(`Found ${artists.length} artists to backfill`);

  for (const artist of artists) {
    const base = generateSlug(artist.name);
    let slug = base;
    let n = 1;

    while (await Artist.findOne({ slug, _id: { $ne: artist._id } })) {
      slug = `${base}-${n++}`;
    }

    // Use direct collection update so pre-save hook doesn't conflict
    await Artist.collection.updateOne({ _id: artist._id }, { $set: { slug } });

    console.log(`✔ ${artist.name} → ${slug}`);
  }

  // Sync indexes (ensures unique index on slug)
  await Artist.syncIndexes();
  console.log("Indexes synced ✅");

  await mongoose.disconnect();
  console.log("Done 🎉");
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});
