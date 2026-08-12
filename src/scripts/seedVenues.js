// src/scripts/seedVenues.js
const mongoose = require("mongoose");
const Venue = require("../modules/venue/venue.model");
const venuesData = require("../seed/venues");
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

// Seed venues
const seedVenues = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🌱 Starting venue seeding...");
    console.log(`📦 Total venues to create: ${venuesData.length}`);

    // Optional: Clear existing venues (uncomment if you want to replace all)
    // await Venue.deleteMany({});
    // console.log("🗑️ Cleared existing venues");

    // Insert all venues
    const result = await Venue.insertMany(venuesData);
    
    console.log(`✅ Successfully created ${result.length} venues!`);
    console.log("\n📊 Summary:");
    
    // Group by category
    const categories = {};
    result.forEach(v => {
      categories[v.category] = (categories[v.category] || 0) + 1;
    });
    console.log("\n📈 By Category:");
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });

    // Group by location
    const locations = {};
    result.forEach(v => {
      const country = v.location.split(',')[v.location.split(',').length - 1]?.trim() || "Unknown";
      locations[country] = (locations[country] || 0) + 1;
    });
    console.log("\n🌍 By Country:");
    Object.entries(locations).forEach(([country, count]) => {
      console.log(`   - ${country}: ${count}`);
    });

    // Featured venues count
    const featuredCount = result.filter(v => v.featured).length;
    console.log(`\n⭐ Featured Venues: ${featuredCount}`);

    // List all venues
    console.log("\n📋 Venue List:");
    result.forEach((v, index) => {
      console.log(`   ${index + 1}. ${v.name} - ${v.location} (${v.category})`);
    });

    console.log("\n✨ Seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding venues:", error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
};

// Run the seed function
seedVenues();