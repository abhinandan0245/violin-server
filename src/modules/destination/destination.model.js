// src/modules/destination/destination.model.js
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    // ✅ Remove 'name' field
    // ✅ Add country, state, city
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
    image: {
      type: String,
      required: [false, "Image is required"],
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
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Destination", destinationSchema);