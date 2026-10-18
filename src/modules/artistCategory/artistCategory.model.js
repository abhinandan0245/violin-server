const mongoose = require("mongoose");

const artistCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
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

// ─── Helper: generate a URL-safe slug ───────────────────────────────
const generateSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_]+/g, "-")  // spaces/underscores → hyphen
    .replace(/^-+|-+$/g, ""); // trim hyphens

// ─── Helper: ensure slug is unique ──────────────────────────────────
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await mongoose.models.ArtistCategory.findOne(query);
    if (!existing) return slug;

    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// ─── Pre-save hook: auto-generate slug ──────────────────────────────
artistCategorySchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    const baseSlug = generateSlug(this.name);
    this.slug = await ensureUniqueSlug(baseSlug, this._id);
  }
});

// ─── Pre-update hook: regenerate slug when name changes ─────────────
artistCategorySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update.name) {
    const baseSlug = generateSlug(update.name);
    const currentId = this.getQuery()._id;
    update.slug = await ensureUniqueSlug(baseSlug, currentId);
  }

  // If slug is explicitly provided, clean it
  if (update.slug) {
    update.slug = generateSlug(update.slug);
  }

});

// ─── Indexes ────────────────────────────────────────────────────────
artistCategorySchema.index({ order: 1 });
artistCategorySchema.index({ isActive: 1 });
// slug already indexed via unique:true

module.exports = mongoose.model("ArtistCategory", artistCategorySchema);