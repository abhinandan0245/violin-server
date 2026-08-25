// src/modules/journal/journal.model.js
const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [false, "Title is required"],
      trim: true,
    },
    // ✅ SLUG REMOVED - No longer needed
    category: {
      type: String,
      required: [false, "Category is required"],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [false, "Excerpt is required"],
      trim: true,
      maxlength: [200, "Excerpt cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [false, "Content is required"],
    },
    image: {
      type: String,
      required: [false, "Image is required"],
    },
    images: [
      {
        type: String,
      },
    ],
    author: {
      type: String,
      trim: true,
      default: "Violin Events",
    },
    date: {
      type: String,
      required: [false, "Date is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    readTime: {
      type: String,
      default: "5 min read",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Journal", journalSchema);
