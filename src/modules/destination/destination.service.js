// src/modules/destination/destination.service.js
const Destination = require("./destination.model");

class DestinationService {
  // Get all destinations
 static async getAll(filters) {
    const { country, state, city, category, page, limit } = filters;

    // 1. Build the dynamic MongoDB query object
    const query = {};

    // We use $regex with 'i' for case-insensitive matching
    if (country) {
      query.country = { $regex: new RegExp(country, "i") };
    }
    if (state) {
      query.state = { $regex: new RegExp(state, "i") };
    }
    if (city) {
      query.city = { $regex: new RegExp(city, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }

    // 2. Calculate pagination variables
    const skip = (page - 1) * limit;

    // 3. Execute the database queries concurrently for speed
    const [destinations, total] = await Promise.all([
      Destination.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit),
      Destination.countDocuments(query)
    ]);

    // 4. Return the exact shape your frontend Dropdown Menu is expecting!
    return {
      destinations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get featured destinations
  static async getFeatured() {
    return await Destination.find({ featured: true }).limit(6);
  }

  // Get single destination
  static async getById(id) {
    return await Destination.findById(id);
  }

  // Create destination (Admin only)
  static async create(data) {
    return await Destination.create(data);
  }

  // ✅ Update destination with returnDocument
  static async update(id, data) {
    return await Destination.findByIdAndUpdate(id, data, {
      returnDocument: "after", // ✅ Fixed deprecation warning
      runValidators: true,
    });
  }

  // Delete destination (Admin only)
  static async delete(id) {
    return await Destination.findByIdAndDelete(id);
  }
}

module.exports = DestinationService;
  