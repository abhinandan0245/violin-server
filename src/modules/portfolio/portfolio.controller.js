const PortfolioService = require("./portfolio.service");
const cloudinary = require("../../config/cloudinary");

class PortfolioController {
  static async getAll(req, res) {
    try {
      const result = await PortfolioService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getFeatured(req, res) {
    try {
      const items = await PortfolioService.getFeatured();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // NEW: Get all video URLs
  static async getVideos(req, res) {
    try {
      const videos = await PortfolioService.getVideos();
      res.status(200).json({
        success: true,
        data: videos,
        count: videos.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getById(req, res) {
    try {
      const item = await PortfolioService.getById(req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Portfolio item not found",
        });
      }
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create Portfolio with Image Upload
  static async create(req, res) {
    try {
      const data = req.body;

      // If image uploaded, add Cloudinary URL
      if (req.file) {
        data.image = req.file.path; // Cloudinary URL
      }

      // If multiple images uploaded
      if (req.files && req.files.length > 0) {
        data.images = req.files.map((file) => file.path);
        // If no main image set, use first image as main
        if (!data.image && req.files.length > 0) {
          data.image = req.files[0].path;
        }
      }

      // If no image uploaded, return error
      if (!data.image) {
        return res.status(400).json({
          success: false,
          message: "Please upload at least one image",
        });
      }

      // Video URL is directly taken from body (optional)
      // videoUrl field is already in schema

      const item = await PortfolioService.create(data);

      res.status(201).json({
        success: true,
        message: "Portfolio item created successfully",
        data: item,
      });
    } catch (error) {
      // If error, delete uploaded images from Cloudinary
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

  // Update Portfolio with Image Upload
  static async update(req, res) {
    try {
      const existingItem = await PortfolioService.getById(req.params.id);

      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Portfolio item not found",
        });
      }

      const data = req.body;

      // If new image uploaded
      if (req.file) {
        // Delete old image from Cloudinary
        if (existingItem.image) {
          const publicId = existingItem.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/portfolio/${publicId}`,
          );
        }
        data.image = req.file.path;
      }

      // If multiple images uploaded
      if (req.files && req.files.length > 0) {
        // Delete old images from Cloudinary
        if (existingItem.images && existingItem.images.length > 0) {
          for (const img of existingItem.images) {
            const publicId = img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/portfolio/${publicId}`,
            );
          }
        }
        data.images = req.files.map((file) => file.path);
        // Update main image if not provided separately
        if (!req.file && req.files.length > 0) {
          data.image = req.files[0].path;
        }
      }

      // Video URL is directly taken from body (optional)
      // videoUrl field is already in schema

      const item = await PortfolioService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: "Portfolio item updated successfully",
        data: item,
      });
    } catch (error) {
      // If error, delete newly uploaded images from Cloudinary
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

  // Delete Portfolio (Delete images too)
  static async delete(req, res) {
    try {
      const item = await PortfolioService.getById(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Portfolio item not found",
        });
      }

      // Delete main image from Cloudinary
      if (item.image) {
        const publicId = item.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `violin-events/portfolio/${publicId}`,
        );
      }

      // Delete all images from Cloudinary
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/portfolio/${publicId}`,
          );
        }
      }

      await PortfolioService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Portfolio item deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PortfolioController;
