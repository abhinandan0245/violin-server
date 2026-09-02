// src/modules/destination/destination.model.js
const mongoose = require("mongoose");

// src/modules/destination/destination.model.js
const destinationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [false, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [false, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [false, "City is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [false, "Category is required"],
    },
    tagline: {
      type: String,
      required: [false, "Tagline is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [false, "Image is required"],
    },
    bannerImage: {
      type: String,
      required: [false, "Banner image is required"],
    },
    price: {
      type: String,
      required: [false, "Price is required"],
    },
    description: {
      type: String,
      required: [false, "Description is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Destination", destinationSchema);