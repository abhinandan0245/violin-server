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

  static async getVideos(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const result = await PortfolioService.getVideos({ page, limit });
      res.status(200).json({
        success: true,
        data: result,
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

  // ✅ Create with multiple images - FIXED
  static async create(req, res) {
    try {
      const data = req.body;
      const files = req.files || {};

      console.log("Files received:", Object.keys(files));

      // Handle main image
      if (files.image && files.image.length > 0) {
        data.image = files.image[0].path;
      }

      // Handle additional images
      if (files.images && files.images.length > 0) {
        data.images = files.images.map((file) => file.path);
        if (!data.image && files.images.length > 0) {
          data.image = files.images[0].path;
        }
      }

      // If no image uploaded, return error
      if (!data.image) {
        return res.status(400).json({
          success: false,
          message: "Please upload at least one image",
        });
      }

      // Parse highlights if sent as JSON string
      if (data.highlights && typeof data.highlights === "string") {
        try {
          data.highlights = JSON.parse(data.highlights);
        } catch (e) {
          data.highlights = data.highlights
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean);
        }
      }

      const item = await PortfolioService.create(data);

      res.status(201).json({
        success: true,
        message: "Portfolio item created successfully",
        data: item,
      });
    } catch (error) {
      console.error("Create error:", error);

      // Delete uploaded images on error
      const files = req.files || {};

      if (files.image && files.image.length > 0) {
        try {
          const publicId =
            files.image[0].filename ||
            files.image[0].path.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
      }
      if (files.images && files.images.length > 0) {
        for (const file of files.images) {
          try {
            const publicId =
              file.filename || file.path.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {}
        }
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Update with multiple images - FIXED
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
      const files = req.files || {};

      console.log("Files received:", Object.keys(files));

      // Handle main image update
      if (files.image && files.image.length > 0) {
        // Delete old main image from Cloudinary
        if (existingItem.image) {
          try {
            const publicId = existingItem.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/portfolio/${publicId}`,
            );
          } catch (e) {}
        }
        data.image = files.image[0].path;
      }

      // Handle additional images
      if (files.images && files.images.length > 0) {
        // Parse existing images from body
        let existingImages = existingItem.images || [];
        if (data.existingImages && typeof data.existingImages === "string") {
          try {
            existingImages = JSON.parse(data.existingImages);
          } catch (e) {
            existingImages = existingItem.images || [];
          }
        }

        // Delete images that are no longer needed
        const imagesToDelete = (existingItem.images || []).filter(
          (img) => !existingImages.includes(img),
        );

        for (const img of imagesToDelete) {
          try {
            const publicId = img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/portfolio/${publicId}`,
            );
          } catch (e) {}
        }

        // Combine existing + new images
        const newImagePaths = files.images.map((file) => file.path);
        data.images = [...existingImages, ...newImagePaths];

        // Update main image if not provided separately
        if (!files.image && files.images.length > 0 && !data.image) {
          data.image = files.images[0].path;
        }
      } else if (
        data.existingImages &&
        typeof data.existingImages === "string"
      ) {
        // If no new images but existingImages is provided
        try {
          data.images = JSON.parse(data.existingImages);
        } catch (e) {
          data.images = existingItem.images || [];
        }
      }

      // Parse highlights
      if (data.highlights && typeof data.highlights === "string") {
        try {
          data.highlights = JSON.parse(data.highlights);
        } catch (e) {
          data.highlights = data.highlights
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean);
        }
      }

      const item = await PortfolioService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: "Portfolio item updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("Update error:", error);

      // Delete newly uploaded images on error
      const files = req.files || {};

      if (files.image && files.image.length > 0) {
        try {
          const publicId =
            files.image[0].filename ||
            files.image[0].path.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
      }
      if (files.images && files.images.length > 0) {
        for (const file of files.images) {
          try {
            const publicId =
              file.filename || file.path.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {}
        }
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

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
        try {
          const publicId = item.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/portfolio/${publicId}`,
          );
        } catch (e) {}
      }

      // Delete all images from Cloudinary
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          try {
            const publicId = img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/portfolio/${publicId}`,
            );
          } catch (e) {}
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
