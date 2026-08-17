// src/modules/portfolioPage/portfolioPage.model.js
const mongoose = require("mongoose");

const portfolioPageSchema = new mongoose.Schema(
  {
    // Hero Banner Image
    heroBanner: {
      type: String,
      trim: true,
    },
    // Footer Banner Image
    footerBanner: {
      type: String,
      trim: true,
    },
    // Center Main Image
    centerImageMain: {
      type: String,
      trim: true,
    },
    // Center Image 1
    centerImage1: {
      type: String,
      trim: true,
    },
    // Center Image 2
    centerImage2: {
      type: String,
      trim: true,
    },
    // Center Image 3
    centerImage3: {
      type: String,
      trim: true,
    },
    // Gallery Images (multiple)
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    // Active status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PortfolioPage", portfolioPageSchema);