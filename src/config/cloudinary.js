// src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

console.log("🔍 Cloudinary Config Check:");
console.log(
  "Cloud Name:",
  process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
);
console.log(
  "API Key:",
  process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
);
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration
try {
  const config = cloudinary.config();
  console.log("✅ Cloudinary configured successfully");
} catch (error) {
  console.error("❌ Cloudinary configuration failed:", error.message);
}

module.exports = cloudinary;
