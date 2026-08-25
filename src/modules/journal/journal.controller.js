// src/modules/journal/journal.controller.js
const JournalService = require("./journal.service");
const cloudinary = require("../../config/cloudinary");

class JournalController {
  // Get all items (Public)
  static async getAll(req, res) {
    try {
      const result = await JournalService.getAll(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get featured items (Public)
  static async getFeatured(req, res) {
    try {
      const items = await JournalService.getFeatured();
      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.error("Error in getFeatured:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get categories (Public)
  static async getCategories(req, res) {
    try {
      const categories = await JournalService.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Error in getCategories:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single item by ID (Public)
  static async getById(req, res) {
    try {
      const item = await JournalService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      console.error("Error in getById:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Create item (Admin)
  // Create item (Admin)
 // Create item (Admin)
static async create(req, res) {
  try {
    const data = req.body;

    console.log("📝 Create Journal Item Request:");
    console.log("Body:", data);
    console.log("File:", req.file ? " Image received" : " No image");

    // If image uploaded, add Cloudinary URL
    if (req.file) {
      data.image = req.file.path;
    }

    // If multiple images uploaded
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.path);
      if (!data.image && req.files.length > 0) {
        data.image = req.files[0].path;
      }
    }

    // Remove empty fields
    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    // Check if there's any data to save
    if (Object.keys(data).length === 0) {
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      return res.status(400).json({
        success: false,
        message: "Please provide at least some data to create a journal item",
      });
    }

    // Generate slug from title if title exists and slug not provided
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Make slug unique if it already exists
      const existingItem = await JournalService.findOne({ slug: data.slug });
      if (existingItem) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    } else if (data.slug) {
      // If slug is provided, make it unique
      const existingItem = await JournalService.findOne({ slug: data.slug });
      if (existingItem) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    const item = await JournalService.create(data);

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error in create:", error);

    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create journal item",
    });
  }
}

// Update item (Admin)
static async update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    console.log("📝 Update Journal Item Request:");
    console.log("ID:", id);
    console.log("Body:", data);
    console.log("File:", req.file ? " Image received" : " No image");

    // If image uploaded, add Cloudinary URL
    if (req.file) {
      data.image = req.file.path;
    }

    // If multiple images uploaded
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.path);
      if (!data.image && req.files.length > 0) {
        data.image = req.files[0].path;
      }
    }

    // Remove empty fields
    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    // If no data to update
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least some data to update",
      });
    }

    // Update slug if title is updated
    if (data.title && !data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Make slug unique if it already exists
      const existingItem = await JournalService.findOne({ 
        slug: data.slug,
        _id: { $ne: id } // Exclude current item
      });
      if (existingItem) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    const item = await JournalService.update(id, data);

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("❌ Error in update:", error);

    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update journal item",
    });
  }
}

  // Update item (Admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      console.log("📝 Update Journal Item Request:");
      console.log("ID:", id);
      console.log("Body:", data);
      console.log("File:", req.file ? " Image received" : " No image");

      // If image uploaded, add Cloudinary URL
      if (req.file) {
        data.image = req.file.path;
      }

      // If multiple images uploaded
      if (req.files && req.files.length > 0) {
        data.images = req.files.map((file) => file.path);
        if (!data.image && req.files.length > 0) {
          data.image = req.files[0].path;
        }
      }

      // Remove empty fields
      Object.keys(data).forEach((key) => {
        if (data[key] === "" || data[key] === null || data[key] === undefined) {
          delete data[key];
        }
      });

      // If no data to update
      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide at least some data to update",
        });
      }

      const item = await JournalService.update(id, data);

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("❌ Error in update:", error);

      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            await cloudinary.uploader.destroy(file.filename);
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to update journal item",
      });
    }
  }

  // Update item (Admin)
  static async update(req, res) {
    try {
      const existingItem = await JournalService.getById(req.params.id);

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      const data = req.body;

      // If new image uploaded
      if (req.file) {
        if (existingItem.image) {
          const publicId = existingItem.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/journal/${publicId}`,
          );
        }
        data.image = req.file.path;
      }

      // If multiple images uploaded
      if (req.files && req.files.length > 0) {
        if (existingItem.images && existingItem.images.length > 0) {
          for (const img of existingItem.images) {
            const publicId = img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/journal/${publicId}`,
            );
          }
        }
        data.images = req.files.map((file) => file.path);
        if (!req.file && req.files.length > 0) {
          data.image = req.files[0].path;
        }
      }

      const item = await JournalService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("Error in update:", error);

      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          await cloudinary.uploader.destroy(file.filename);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete item (Admin)
  static async delete(req, res) {
    try {
      const item = await JournalService.getById(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Delete main image from Cloudinary
      if (item.image) {
        const publicId = item.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`violin-events/journal/${publicId}`);
      }

      // Delete all images from Cloudinary
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/journal/${publicId}`,
          );
        }
      }

      await JournalService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get statistics (Admin)
  static async getStats(req, res) {
    try {
      const stats = await JournalService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getStats:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = JournalController;
