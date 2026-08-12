const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // Enum removed - now any string can be added
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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
