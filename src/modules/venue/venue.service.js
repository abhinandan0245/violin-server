const Venue = require("./venue.model");

class VenueService {
  static async getAll(query = {}) {
    const {
      featured,
      category,
      country,
      state,
      city,
      search,
      limit = 100,
      page = 1,
    } = query;
    const filter = {};

    // Apply filters
    if (featured) filter.featured = featured === "true";
    if (category) filter.category = category;

    // ✅ COUNTRY FILTER
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }

    // ✅ STATE FILTER
    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }

    // ✅ CITY FILTER
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    // ✅ SEARCH BY NAME, COUNTRY, STATE, CITY, CATEGORY
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
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
    return await Venue.find({ featured: true }).limit(15);
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

  // ✅ GET ALL COUNTRIES (for filter dropdown)
  static async getCountries() {
    const countries = await Venue.distinct("country");
    return countries.filter((country) => country && country.trim() !== "");
  }

  // ✅ GET ALL STATES (optionally scoped to a country, for cascading filter dropdown)
  static async getStates(country) {
    const filter = {};
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }
    const states = await Venue.distinct("state", filter);
    return states.filter((state) => state && state.trim() !== "");
  }

  // ✅ GET ALL CITIES (optionally scoped to country/state, for cascading filter dropdown)
  static async getCities(country, state) {
    const filter = {};
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }
    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }
    const cities = await Venue.distinct("city", filter);
    return cities.filter((city) => city && city.trim() !== "");
  }

  // ✅ GET COMBINED LOCATION FILTERS IN ONE CALL (country + state + city)
  // Handy for populating the whole filter box in a single request.
  static async getLocationFilters() {
    const [countries, states, cities] = await Promise.all([
      this.getCountries(),
      this.getStates(),
      this.getCities(),
    ]);
    return { countries, states, cities };
  }
}

module.exports = VenueService;
