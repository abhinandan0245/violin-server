// src/modules/venue/venue.service.js
const Venue = require("./venue.model");

class VenueService {
  static async getAll(query = {}) {
    const {
      featured,
      category,
      country,
      search,
      limit = 100,
      page = 1,
    } = query;
    const filter = {};

    // Apply filters
    if (featured) filter.featured = featured === "true";
    if (category) filter.category = category;

    // ✅ ADD COUNTRY FILTER
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }

    // ✅ ADD SEARCH BY COUNTRY AND LOCATION
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

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
    return await Venue.find({ featured: true }).limit(5);
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

  // ✅ ADD METHOD TO GET ALL COUNTRIES (for filter dropdown)
  static async getCountries() {
    const countries = await Venue.distinct("country");
    return countries.filter((country) => country && country.trim() !== "");
  }
}

module.exports = VenueService;
