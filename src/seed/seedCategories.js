// src/scripts/seedCategories.js
const mongoose = require("mongoose");
const ArtistCategory = require("../modules/artistCategory/artistCategory.model");
require("dotenv").config();

const categories = [
  {
    name: "Bollywood Celebrities",
    order: 1,
    description: "Actors, Actresses, Influencers & Celebrity Guests",
    isActive: true,
  },
  {
    name: "Singers & Vocalists",
    order: 2,
    description:
      "Performers, Singers, Industry Stars, Music Producers & Independent Singers",
    isActive: true,
  },
  {
    name: "Dance & Electronic Arts",
    order: 3,
    description:
      "Creative Dancers, Vending Dancers, EDM Artists & Instrumental Dancers",
    isActive: true,
  },
  {
    name: "Artistes & Hosts",
    order: 4,
    description:
      "Wedding Artistes, Corporate Venues, Celebrity Hires & Multilingual Artistes",
    isActive: true,
  },
  {
    name: "Live Bands",
    order: 5,
    description: "Restaurant Bands, Fusion Bands, Rock Bands & Acoustic Bands",
    isActive: true,
  },
  {
    name: "Sufi & Qawwali Artists",
    order: 6,
    description: "Spiritual Gurus, Choir Artists & Classical Fusion Artists",
    isActive: true,
  },
  {
    name: "Wedding Entertainment",
    order: 7,
    description:
      "DJs, DJ Assistants, Band Members, Event Staff & Special Occasions",
    isActive: true,
  },
  {
    name: "Dance Performers",
    order: 8,
    description:
      "Ballroom Dance Performers, Contemporary Dance, Club/Entertainment & LED Stage Shows",
    isActive: true,
  },
  {
    name: "Folk & Cultural Artists",
    order: 9,
    description:
      "Traditional Folk Artists, Kettle Drummers & Regional Culture Arts",
    isActive: true,
  },
  {
    name: "Special Acts & Stage Shows",
    order: 10,
    description: "Festivals, Live Events, Awards & Showcases",
    isActive: true,
  },
  {
    name: "Instrumental Artists",
    order: 11,
    description: "Saxophones, Violins, Pianos, Percussion & Live Ensembles",
    isActive: true,
  },
  {
    name: "International Talent",
    order: 12,
    description: "Immersive Instruments, Drums, Keys & Cultures Performers",
    isActive: true,
  },
  {
    name: "Corporate & Luxury Entertainment",
    order: 13,
    description:
      "Branding, Entertainment, Celebrity Services & Corporate Partners",
    isActive: true,
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/violin-events",
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing categories
    const deleted = await ArtistCategory.deleteMany({});
    console.log(`🗑️ Cleared ${deleted.deletedCount} existing categories`);

    // Insert new categories
    const inserted = await ArtistCategory.insertMany(categories);
    console.log(`✅ Inserted ${inserted.length} categories`);

    // Verify
    const count = await ArtistCategory.countDocuments();
    console.log(`📊 Total categories in DB: ${count}`);

    // Show all categories
    const allCategories = await ArtistCategory.find().sort({ order: 1 });
    console.log("\n📋 All Categories:");
    allCategories.forEach((cat, i) => {
      console.log(
        `  ${i + 1}. ${cat.name} (Order: ${cat.order}) - ${cat.isActive ? "✅ Active" : "❌ Inactive"}`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
