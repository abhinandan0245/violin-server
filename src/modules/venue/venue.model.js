const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, "Venue name is required"],
      trim: true,
      unique: true,
    },
    // ✅ REMOVED "location" — replaced by country / state / city below
    country: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    // ✅ ADD STATE FIELD
    state: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    // ✅ ADD CITY FIELD
    city: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [false, "Category is required"],
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    capacity: {
      type: String,
      required: [false, "Capacity is required"],
    },
    description: {
      type: String,
      required: [false, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    amenities: [
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
    videoUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Venue", venueSchema);