const ArtistCategory = require("./artistCategory.model");

class ArtistCategoryController {
  // ✅ Get all categories
 static async getAll(req, res) {
    try {
      const { isActive, limit = 100, page = 1 } = req.query;
      const filter = {};

      // ✅ Only filter if isActive is provided
      if (isActive !== undefined && isActive !== '') {
        filter.isActive = isActive === "true";
      }
      // ✅ If no isActive filter, return ALL categories (both active and inactive)

      const skip = (parseInt(page) - 1) * parseInt(limit);

      console.log("📊 Filter:", filter);
      console.log("📊 Skip:", skip, "Limit:", limit);

      const [items, total] = await Promise.all([
        ArtistCategory.find(filter)
          .sort({ order: 1, name: 1 })
          .limit(parseInt(limit))
          .skip(skip),
        ArtistCategory.countDocuments(filter),
      ]);

      console.log("📊 Found items:", items.length);
      console.log("📊 Total count:", total);

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
      console.error("Error fetching artist categories:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get active categories (for public use)
  static async getActive(req, res) {
    try {
      const categories = await ArtistCategory.find({ isActive: true })
        .sort({ order: 1, name: 1 });

      res.status(200).json({
        success: true,
        data: categories,
        count: categories.length,
      });
    } catch (error) {
      console.error("Error fetching active artist categories:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get single category by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const category = await ArtistCategory.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Artist category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Error fetching artist category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get category by slug (name as slug)
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const category = await ArtistCategory.findOne({
        name: { $regex: new RegExp(`^${slug}$`, "i") },
        isActive: true,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Artist category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Error fetching artist category by slug:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Create new category
  static async create(req, res) {
    try {
      const data = req.body;

      // If image uploaded, add Cloudinary URL
      if (req.file) {
        data.image = req.file.path;
      }

      // Check if category already exists
      const existing = await ArtistCategory.findOne({
        name: { $regex: new RegExp(`^${data.name}$`, "i") },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      const category = await ArtistCategory.create(data);

      res.status(201).json({
        success: true,
        message: "Artist category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Error creating artist category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Update category
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const category = await ArtistCategory.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Artist category not found",
        });
      }

      // If new image uploaded
      if (req.file) {
        data.image = req.file.path;
      }

      // Check if name already exists (excluding current category)
      if (data.name) {
        const existing = await ArtistCategory.findOne({
          name: { $regex: new RegExp(`^${data.name}$`, "i") },
          _id: { $ne: id },
        });

        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Category with this name already exists",
          });
        }
      }

      const updatedCategory = await ArtistCategory.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Artist category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating artist category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Toggle category status (activate/deactivate)
  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const category = await ArtistCategory.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Artist category not found",
        });
      }

      category.isActive = isActive !== undefined ? isActive : !category.isActive;
      await category.save();

      res.status(200).json({
        success: true,
        message: `Category ${category.isActive ? "activated" : "deactivated"} successfully`,
        data: category,
      });
    } catch (error) {
      console.error("Error toggling artist category status:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Reorder categories
  static async reorder(req, res) {
    try {
      const { orders } = req.body; // [{ id: "id", order: 0 }, ...]

      if (!Array.isArray(orders)) {
        return res.status(400).json({
          success: false,
          message: "Orders must be an array",
        });
      }

      const bulkOps = orders.map(({ id, order }) => ({
        updateOne: {
          filter: { _id: id },
          update: { order },
        },
      }));

      await ArtistCategory.bulkWrite(bulkOps);

      const updatedCategories = await ArtistCategory.find()
        .sort({ order: 1, name: 1 });

      res.status(200).json({
        success: true,
        message: "Categories reordered successfully",
        data: updatedCategories,
      });
    } catch (error) {
      console.error("Error reordering artist categories:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Delete category
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await ArtistCategory.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Artist category not found",
        });
      }

      // Check if category has artists (if you have Artist model)
      // const Artist = require("../artist/artist.model");
      // const artistCount = await Artist.countDocuments({ category: id });
      // if (artistCount > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `Cannot delete category with ${artistCount} associated artists. Remove artists first.`,
      //   });
      // }

      await ArtistCategory.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Artist category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting artist category:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Bulk delete categories
  static async bulkDelete(req, res) {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide an array of category IDs to delete",
        });
      }

      const result = await ArtistCategory.deleteMany({
        _id: { $in: ids },
      });

      res.status(200).json({
        success: true,
        message: `${result.deletedCount} categories deleted successfully`,
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      console.error("Error bulk deleting artist categories:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ArtistCategoryController;