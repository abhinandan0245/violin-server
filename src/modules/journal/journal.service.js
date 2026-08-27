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
    // Increment views
    await Journal.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return await Journal.findById(id);
  }

  // Get single item by slug
  static async getBySlug(slug) {
    const item = await Journal.findOne({ slug, isActive: true });
    if (item) {
      await Journal.findByIdAndUpdate(item._id, { $inc: { views: 1 } });
    }
    return item;
  }

  // ✅ ADD THIS METHOD - Find one item by filter
  static async findOne(filter) {
    return await Journal.findOne(filter);
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
