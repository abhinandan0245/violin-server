const Artist = require("./artist.model");
const ArtistCategory = require("../artistCategory/artistCategory.model");

class ArtistController {
  // ✅ Get all artists
  static async getAll(req, res) {
    try {
      const {
        category,
        featured,
        isActive,
        search,
        minPrice,
        maxPrice,
        limit = 100,
        page = 1,
      } = req.query;

      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (featured !== undefined) {
        filter.featured = featured === "true";
      }

      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }

      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = parseInt(minPrice);
        if (maxPrice !== undefined) filter.price.$lte = parseInt(maxPrice);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [items, total] = await Promise.all([
        Artist.find(filter)
          .populate("category", "name image")
          .sort({ featured: -1, name: 1 })
          .limit(parseInt(limit))
          .skip(skip),
        Artist.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: {
          items,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get featured artists
  static async getFeatured(req, res) {
    try {
      const { limit = 10 } = req.query;

      const artists = await Artist.find({
        featured: true,
        isActive: true,
      })
        .populate("category", "name image")
        .sort({ name: 1 })
        .limit(parseInt(limit));

      res.status(200).json({
        success: true,
        data: artists,
        count: artists.length,
      });
    } catch (error) {
      console.error("Error fetching featured artists:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get artists by category
  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { limit = 100, page = 1 } = req.query;

      // Check if category exists
      const category = await ArtistCategory.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const filter = {
        category: categoryId,
        isActive: true,
      };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [items, total] = await Promise.all([
        Artist.find(filter)
          .populate("category", "name image")
          .sort({ featured: -1, name: 1 })
          .limit(parseInt(limit))
          .skip(skip),
        Artist.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: {
          category,
          items,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching artists by category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get single artist by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const artist = await Artist.findById(id).populate("category", "name image description");

      if (!artist) {
        return res.status(404).json({
          success: false,
          message: "Artist not found",
        });
      }

      res.status(200).json({
        success: true,
        data: artist,
      });
    } catch (error) {
      console.error("Error fetching artist:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Create new artist
  static async create(req, res) {
    try {
      const data = req.body;

      // Handle image upload
      if (req.file) {
        data.image = req.file.path;
      }

      // Validate required fields
      if (!data.name) {
        return res.status(400).json({
          success: false,
          message: "Artist name is required",
        });
      }

      if (!data.category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      if (!data.image) {
        return res.status(400).json({
          success: false,
          message: "Artist image is required",
        });
      }

      if (data.price === undefined || data.price === null) {
        return res.status(400).json({
          success: false,
          message: "Price is required",
        });
      }

      // Check if category exists
      const category = await ArtistCategory.findById(data.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }

      // Parse languages if sent as string
      if (data.languages && typeof data.languages === "string") {
        try {
          data.languages = JSON.parse(data.languages);
        } catch (e) {
          data.languages = data.languages.split(",").map((l) => l.trim());
        }
      }

      const artist = await Artist.create(data);

      // Populate category for response
      await artist.populate("category", "name image");

      res.status(201).json({
        success: true,
        message: "Artist created successfully",
        data: artist,
      });
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Update artist
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const artist = await Artist.findById(id);
      if (!artist) {
        return res.status(404).json({
          success: false,
          message: "Artist not found",
        });
      }

      // Handle image upload
      if (req.file) {
        data.image = req.file.path;
      }

      // Check if category exists (if updating category)
      if (data.category) {
        const category = await ArtistCategory.findById(data.category);
        if (!category) {
          return res.status(400).json({
            success: false,
            message: "Category not found",
          });
        }
      }

      // Parse languages if sent as string
      if (data.languages && typeof data.languages === "string") {
        try {
          data.languages = JSON.parse(data.languages);
        } catch (e) {
          data.languages = data.languages.split(",").map((l) => l.trim());
        }
      }

      const updatedArtist = await Artist.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).populate("category", "name image");

      res.status(200).json({
        success: true,
        message: "Artist updated successfully",
        data: updatedArtist,
      });
    } catch (error) {
      console.error("Error updating artist:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Toggle artist featured status
  static async toggleFeatured(req, res) {
    try {
      const { id } = req.params;

      const artist = await Artist.findById(id);
      if (!artist) {
        return res.status(404).json({
          success: false,
          message: "Artist not found",
        });
      }

      artist.featured = !artist.featured;
      await artist.save();

      res.status(200).json({
        success: true,
        message: `Artist ${artist.featured ? "featured" : "unfeatured"} successfully`,
        data: artist,
      });
    } catch (error) {
      console.error("Error toggling artist featured:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Toggle artist active status
  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const artist = await Artist.findById(id);
      if (!artist) {
        return res.status(404).json({
          success: false,
          message: "Artist not found",
        });
      }

      artist.isActive = isActive !== undefined ? isActive : !artist.isActive;
      await artist.save();

      res.status(200).json({
        success: true,
        message: `Artist ${artist.isActive ? "activated" : "deactivated"} successfully`,
        data: artist,
      });
    } catch (error) {
      console.error("Error toggling artist status:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Delete artist
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const artist = await Artist.findById(id);
      if (!artist) {
        return res.status(404).json({
          success: false,
          message: "Artist not found",
        });
      }

      await Artist.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Artist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting artist:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Bulk delete artists
  static async bulkDelete(req, res) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of artist IDs to delete",
        });
      }

      const result = await Artist.deleteMany({
        _id: { $in: ids },
      });

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} artists deleted successfully`,
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      console.error("Error bulk deleting artists:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ArtistController;