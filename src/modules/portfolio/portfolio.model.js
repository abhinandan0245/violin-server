const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    // Common fields
    title: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
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
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    
    // Portfolio Type: 'image' or 'video'
    portfolioType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },

    // Image-based portfolio fields
    image: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    guests: {
      type: Number,
    },

    // Video-based portfolio fields
    videoUrl: {
      type: String,
      trim: true,
    },
    videoThumbnail: {
      type: String,
      trim: true,
    },
    videoDuration: {
      type: String,
    },
    videoViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
portfolioSchema.index({ portfolioType: 1, createdAt: -1 });
portfolioSchema.index({ featured: 1, portfolioType: 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);