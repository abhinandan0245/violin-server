// src/modules/destination/destination.model.js
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    category: { type: String },
    tagline: { type: String, trim: true },
    image: { type: String },
    bannerImage: { type: String },
    price: { type: String },
    description: { type: String },
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // ✅ NEW: Slug field
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

// ✅ Helper: create a URL-safe slug
function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // spaces/underscores -> dash
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-") // collapse dashes
    .replace(/^-+|-+$/g, ""); // trim dashes at ends
}

// ✅ Helper: generate a unique slug (city-state-country + counter)
async function generateUniqueSlug(data, excludeId = null) {
  const parts = [data.city, data.state, data.country].filter(Boolean);
  let base = slugify(parts.join(" ")) || "destination";

  let slug = base;
  let counter = 1;

  // Keep incrementing until unique
  while (true) {
    const existing = await mongoose.models.Destination.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });
    if (!existing) break;
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// ✅ Auto-generate slug before save (create)
// ✅ Auto-generate slug before save (create)
destinationSchema.pre("save", async function () {
  // If slug already exists and hasn't been explicitly modified, do nothing
  if (!this.isModified("slug") && this.slug) return;

  // Only generate if at least city/state/country provided
  if (this.city || this.state || this.country) {
    this.slug = await generateUniqueSlug(this.toObject());
  }
});

// ✅ Static helpers (used by service layer)
destinationSchema.statics.slugify = slugify;
destinationSchema.statics.generateUniqueSlug = generateUniqueSlug;

module.exports = mongoose.model("Destination", destinationSchema);
