// src/scripts/migrate-portfolio-type.js
const mongoose = require("mongoose");
require("dotenv").config();

// Import your Portfolio model
const Portfolio = require("../modules/portfolio/portfolio.model");

// MongoDB connection string from your environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  console.log("Please set MONGODB_URI in your .env file");
  process.exit(1);
}

async function migratePortfolioType() {
  try {
    // Connect to MongoDB - removed deprecated options
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find all portfolio items that don't have portfolioType field or have null/undefined
    const itemsToUpdate = await Portfolio.find({
      $or: [
        { portfolioType: { $exists: false } },
        { portfolioType: null },
        { portfolioType: "" },
      ],
    });

    console.log(`📊 Found ${itemsToUpdate.length} items to migrate\n`);

    if (itemsToUpdate.length === 0) {
      console.log("✅ All items already have portfolioType set");
      await mongoose.disconnect();
      return;
    }

    // Display items that will be updated
    console.log("📋 Items to be updated:");
    console.log("-".repeat(80));
    itemsToUpdate.forEach((item, index) => {
      const title = item.title || 'Untitled';
      const hasVideo = item.videoUrl && item.videoUrl.trim() !== '';
      const type = hasVideo ? 'video' : 'image';
      console.log(`${index + 1}. ${title} → ${type} ${hasVideo ? '(has video)' : ''}`);
    });
    console.log("-".repeat(80));
    console.log("");

    // Check if running in dry run mode
    const isDryRun = process.argv.includes('--dry-run');
    
    if (isDryRun) {
      console.log("🔍 DRY RUN MODE - No changes will be made");
      console.log("✅ DRY RUN completed. Run without --dry-run to apply changes.");
      await mongoose.disconnect();
      return;
    }

    // Confirm before proceeding
    console.log("⚠️  This will update the portfolioType for all items listed above.");
    console.log("⚠️  Do you want to continue? (Type 'yes' to proceed)");
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise((resolve) => {
      rl.question('Type "yes" to continue: ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log("❌ Migration cancelled.");
      await mongoose.disconnect();
      return;
    }

    console.log("");
    console.log("🔄 Starting migration...\n");

    // Update each item
    let updatedCount = 0;
    let errorCount = 0;

    for (const item of itemsToUpdate) {
      try {
        const hasVideo = item.videoUrl && item.videoUrl.trim() !== '';
        const newType = hasVideo ? 'video' : 'image';
        
        item.portfolioType = newType;
        await item.save();
        
        updatedCount++;
        console.log(`✅ ${updatedCount}. "${item.title || 'Untitled'}" → ${newType}`);
      } catch (err) {
        console.error(`❌ Error updating item ${item._id}:`, err.message);
        errorCount++;
      }
    }

    console.log("");
    console.log("📊 Migration Summary:");
    console.log(`✅ Successfully updated: ${updatedCount} items`);
    if (errorCount > 0) {
      console.log(`❌ Failed to update: ${errorCount} items`);
    }
    console.log("");

    // Verify the migration
    const totalItems = await Portfolio.countDocuments();
    const imageItems = await Portfolio.countDocuments({ portfolioType: 'image' });
    const videoItems = await Portfolio.countDocuments({ portfolioType: 'video' });
    const nullItems = await Portfolio.countDocuments({
      $or: [
        { portfolioType: { $exists: false } },
        { portfolioType: null },
        { portfolioType: "" },
      ],
    });

    console.log("📈 Final Count:");
    console.log(`Total items: ${totalItems}`);
    console.log(`Image items: ${imageItems}`);
    console.log(`Video items: ${videoItems}`);
    console.log(`Items without type: ${nullItems}`);

    if (nullItems === 0) {
      console.log("✅ Migration completed successfully!");
    } else {
      console.log(`⚠️ ${nullItems} items still need migration`);
    }

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the migration
migratePortfolioType();