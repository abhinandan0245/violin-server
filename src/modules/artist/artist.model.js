const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtistCategory",
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Artist image is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    priceUnit: {
      type: String,
      enum: ["lakh", "thousand", "crore"],
      default: "lakh",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Social Links
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    youtube: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    // Additional Information
    languages: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ["available", "busy", "on-tour", "unavailable"],
      default: "available",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
artistSchema.index({ name: 1 });
artistSchema.index({ category: 1 });
artistSchema.index({ featured: 1 });
artistSchema.index({ isActive: 1 });
artistSchema.index({ price: 1 });

module.exports = mongoose.model("Artist", artistSchema);