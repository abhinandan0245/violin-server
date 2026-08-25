const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [false, "Title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [false, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [false, "Category is required"],
      // Enum removed - now any string can be added
    },
    image: {
      type: String,
      required: [false, "Image is required"],
    },
    date: {
      type: String,
      required: [false, "Date is required"],
    },
    guests: {
      type: Number,
      required: [false, "Number of guests is required"],
    },
    description: {
      type: String,
      required: [false, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    clientName: {
      type: String,
      trim: true,
    },
    clientTestimonial: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
      // YouTube, Vimeo, or any video URL
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
