// src/modules/journal/journal.service.js
const Journal = require("./journal.model");

class JournalService {
  // Get all journal items with filters
  static async getAll(query = {}) {
    const { category, featured, limit = 50, page = 1, search } = query;
    const filter = {};

    if (category) filter.category = category;
    if (featured) filter.featured = featured === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Journal.find(filter)
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      Journal.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get featured items
  static async getFeatured() {
    return await Journal.find({ featured: true, isActive: true })
      .limit(6)
      .sort({ createdAt: -1 });
  }

  // Get single item by ID
  static async getById(id) {
    await Journal.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return await Journal.findById(id);
  }

  // ✅ Get single item by slug (already exists, kept here)
  static async getBySlug(slug) {
    const item = await Journal.findOne({ slug, isActive: true });
    if (item) {
      await Journal.findByIdAndUpdate(item._id, { $inc: { views: 1 } });
    }
    return item;
  }

  // Find one item by filter
  static async findOne(filter) {
    return await Journal.findOne(filter);
  }

  // ✅ ADDED: Generate a unique slug
  static async generateUniqueSlug(title, excludeId = null) {
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const query = { slug };
      if (excludeId) {
        query._id = { $ne: excludeId };
      }
      const existing = await Journal.findOne(query);
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Create item
  static async create(data) {
    return await Journal.create(data);
  }

  // Update item
  static async update(id, data) {
    return await Journal.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  // Delete item
  static async delete(id) {
    return await Journal.findByIdAndDelete(id);
  }

  // Get all categories
  static async getCategories() {
    const categories = await Journal.distinct("category");
    return categories;
  }

  // Get statistics
  static async getStats() {
    const total = await Journal.countDocuments();
    const featured = await Journal.countDocuments({ featured: true });
    const active = await Journal.countDocuments({ isActive: true });

    return {
      total,
      featured,
      active,
    };
  }
}

module.exports = JournalService;