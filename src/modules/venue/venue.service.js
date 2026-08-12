const Venue = require("./venue.model");

class VenueService {
  static async getAll(query = {}) {
    const { featured, category, limit = 100, page = 1 } = query;
    const filter = {};

    if (featured) filter.featured = featured === "true";
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const [venues, total] = await Promise.all([
      Venue.find(filter)
        .limit(parseInt(limit))
        .skip(skip)
        .sort({ createdAt: -1 }),
      Venue.countDocuments(filter),
    ]);

    return {
      venues,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getFeatured() {
    return await Venue.find({ featured: true }).limit(3);
  }

  static async getById(id) {
    return await Venue.findById(id);
  }

  static async create(data) {
    return await Venue.create(data);
  }

  static async update(id, data) {
    return await Venue.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id) {
    return await Venue.findByIdAndDelete(id);
  }
}

module.exports = VenueService;
