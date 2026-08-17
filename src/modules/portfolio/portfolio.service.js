const Portfolio = require("./portfolio.model");

class PortfolioService {
  static async getAll(query = {}) {
    const { featured, category, limit = 100, page = 1 } = query;
    const filter = {};

    if (featured) filter.featured = featured === "true";
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Portfolio.find(filter)
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      Portfolio.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  // ✅ REMOVE limit from getFeatured - get ALL featured items
  static async getFeatured() {
    return await Portfolio.find({ featured: true }).sort({ createdAt: -1 });
  }

  static async getById(id) {
    return await Portfolio.findById(id);
  }

  static async create(data) {
    return await Portfolio.create(data);
  }

  static async update(id, data) {
    return await Portfolio.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  static async delete(id) {
    return await Portfolio.findByIdAndDelete(id);
  }

  // ✅ Get videos with pagination
  static async getVideos(query = {}) {
    try {
      const { page = 1, limit = 3 } = query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Find all portfolio items that have a videoUrl
      const filter = {
        videoUrl: { $exists: true, $ne: null, $ne: "" },
        isActive: true,
      };

      const [items, total] = await Promise.all([
        Portfolio.find(filter)
          .limit(parseInt(limit))
          .skip(skip)
          .sort({ createdAt: -1 }),
        Portfolio.countDocuments(filter),
      ]);

      // Return only the video URLs with metadata
      const videos = items.map(item => ({
        id: item._id,
        title: item.title,
        location: item.location,
        category: item.category,
        videoUrl: item.videoUrl,
        image: item.image,
        featured: item.featured,
        date: item.date,
      }));

      return {
        items: videos,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PortfolioService;