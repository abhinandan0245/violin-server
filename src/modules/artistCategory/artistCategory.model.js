const mongoose = require("mongoose");

const artistCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


artistCategorySchema.index({ order: 1 });
artistCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model("ArtistCategory", artistCategorySchema);