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

  static async getFeatured() {
    return await Portfolio.find({ featured: true }).limit(3);
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

   // ✅ NEW: Get all video URLs from portfolio items
  static async getVideos() {
    try {
      // Find all portfolio items that have a videoUrl and are active
      const items = await Portfolio.find({ 
        videoUrl: { $exists: true, $ne: null, $ne: "" },
        isActive: true 
      }).sort({ createdAt: -1 });
      
      // Return only the video URLs with metadata
      return items.map(item => ({
        id: item._id,
        title: item.title,
        location: item.location,
        category: item.category,
        videoUrl: item.videoUrl,
        image: item.image,
        featured: item.featured,
        date: item.date,
      }));
    } catch (error) {
      throw error;
    }
  }

}

module.exports = PortfolioService;
