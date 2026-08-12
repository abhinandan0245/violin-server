// src/scripts/seedDestinations.js
const mongoose = require("mongoose");
const Destination = require("../modules/destination/destination.model");
const destinationsData = require("../seed/destinations");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Seed destinations
const seedDestinations = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🌱 Starting destination seeding...");
    console.log(`📦 Total destinations to create: ${destinationsData.length}`);

    // Clear existing destinations (optional - uncomment if you want to replace all)
    // await Destination.deleteMany({});
    // console.log("🗑️ Cleared existing destinations");

    // Insert all destinations
    const result = await Destination.insertMany(destinationsData);

    console.log(`✅ Successfully created ${result.length} destinations!`);
    console.log("\n📊 Summary:");
    console.log(
      `   - Domestic (India): ${result.filter((d) => d.country === "India").length}`,
    );
    console.log(
      `   - International: ${result.filter((d) => d.country !== "India").length}`,
    );

    // Group by category
    const categories = {};
    result.forEach((d) => {
      categories[d.category] = (categories[d.category] || 0) + 1;
    });
    console.log("\n📈 By Category:");
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });

    // Group by country
    const countries = {};
    result.forEach((d) => {
      countries[d.country] = (countries[d.country] || 0) + 1;
    });
    console.log("\n🌍 By Country:");
    Object.entries(countries).forEach(([country, count]) => {
      console.log(`   - ${country}: ${count}`);
    });

    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding destinations:", error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
};

// Run the seed function
seedDestinations();
