// src/scripts/seedPortfolio.js
const mongoose = require("mongoose");
const Portfolio = require("../modules/portfolio/portfolio.model");
const portfolioData = require("../seed/portfolio");
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

// Seed portfolio items
const seedPortfolio = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log("🌱 Starting portfolio seeding...");
    console.log(`📦 Total portfolio items to create: ${portfolioData.length}`);

    // Optional: Clear existing portfolio items
    // await Portfolio.deleteMany({});
    // console.log("🗑️ Cleared existing portfolio items");

    // Insert all portfolio items
    const result = await Portfolio.insertMany(portfolioData);
    
    console.log(`✅ Successfully created ${result.length} portfolio items!`);
    console.log("\n📊 Summary:");
    
    // Group by category
    const categories = {};
    result.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    console.log("\n📈 By Category:");
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count}`);
    });

    // Featured items count
    const featuredCount = result.filter(item => item.featured).length;
    console.log(`\n⭐ Featured Items: ${featuredCount}`);

    // List all items
    console.log("\n📋 Portfolio Items List:");
    result.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title} - ${item.location} (${item.category})`);
    });

    console.log("\n✨ Seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding portfolio:", error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log("🔌 Database connection closed");
  }
};

// Run the seed function
seedPortfolio();