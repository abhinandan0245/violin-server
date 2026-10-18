const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
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
    instagram: { type: String, trim: true, default: "" },
    facebook: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    // Additional Information
    languages: { type: [String], default: [] },
    availability: {
      type: String,
      enum: ["available", "busy", "on-tour", "unavailable"],
      default: "available",
    },
    location: { type: String, trim: true, default: "" },
    experience: { type: Number, min: 0, default: 0 },
    bio: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// ─── Helpers ────────────────────────────────────────────────────────
const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await mongoose.models.Artist.findOne(query);
    if (!existing) return slug;

    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// ─── Pre-save: auto-generate slug from name ─────────────────────────
artistSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    const baseSlug = generateSlug(this.name);
    this.slug = await ensureUniqueSlug(baseSlug, this._id);
  }
});

// ─── Pre-update: regenerate slug when name changes ──────────────────
artistSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update.name) {
    const baseSlug = generateSlug(update.name);
    const currentId = this.getQuery()._id;
    update.slug = await ensureUniqueSlug(baseSlug, currentId);
  }

  if (update.slug) {
    update.slug = generateSlug(update.slug);
  }

});

// ─── Indexes ────────────────────────────────────────────────────────
artistSchema.index({ name: 1 });
artistSchema.index({ category: 1 });
artistSchema.index({ featured: 1 });
artistSchema.index({ isActive: 1 });
artistSchema.index({ price: 1 });
// slug index auto-created by unique: true

module.exports = mongoose.model("Artist", artistSchema);