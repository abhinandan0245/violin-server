// src/modules/destination/destination.model.js
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    // ✅ Remove 'name' field
    // ✅ Add country, state, city
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [false, "Image is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [100, "Description cannot exceed 100 characters"],
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