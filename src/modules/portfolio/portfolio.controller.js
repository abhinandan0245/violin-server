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
      const { page = 1, limit = 9 } = req.query;
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

  static async getImages(req, res) {
    try {
      const { page = 1, limit = 9 } = req.query;
      const result = await PortfolioService.getImages({ page, limit });
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

  static async create(req, res) {
    try {
      const data = req.body;
      const files = req.files || {};

      console.log("Files received:", Object.keys(files));
      console.log("Portfolio Type:", data.portfolioType);

      // Handle image-based portfolio
      if (data.portfolioType === 'image' || !data.portfolioType) {
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

        // Handle guests
        if (data.guests) {
          data.guests = parseInt(data.guests);
        }
      }

      // Handle video-based portfolio
      if (data.portfolioType === 'video') {
        // Video thumbnail upload
        if (files.videoThumbnail && files.videoThumbnail.length > 0) {
          data.videoThumbnail = files.videoThumbnail[0].path;
        }

        // Clear image fields for video type
        data.image = undefined;
        data.images = undefined;
        data.guests = undefined;
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
      
      const deleteFiles = async (fileArray) => {
        if (fileArray && fileArray.length > 0) {
          for (const file of fileArray) {
            try {
              const publicId = file.filename || file.path.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (e) {}
          }
        }
      };

      await deleteFiles(files.image);
      await deleteFiles(files.images);
      await deleteFiles(files.videoThumbnail);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const files = req.files || {};

      console.log("Files received:", Object.keys(files));
      console.log("Portfolio Type:", data.portfolioType);

      const existingItem = await PortfolioService.getById(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Portfolio item not found",
        });
      }

      // Handle image-based portfolio
      if (data.portfolioType === 'image' || !data.portfolioType) {
        // Handle main image
        if (files.image && files.image.length > 0) {
          // Delete old main image from Cloudinary
          if (existingItem.image) {
            try {
              const publicId = existingItem.image.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (e) {}
          }
          data.image = files.image[0].path;
        }

        // Handle additional images
        if (files.images && files.images.length > 0) {
          const newImages = files.images.map((file) => file.path);
          
          let existingImages = [];
          if (data.existingImages) {
            try {
              existingImages = typeof data.existingImages === 'string' 
                ? JSON.parse(data.existingImages) 
                : data.existingImages;
            } catch (e) {
              existingImages = [];
            }
          }

          data.images = [...existingImages, ...newImages];
          
          if (!data.image && data.images.length > 0) {
            data.image = data.images[0];
          }
        }

        // Handle guests
        if (data.guests) {
          data.guests = parseInt(data.guests);
        }

        // Clear video fields
        data.videoUrl = undefined;
        data.videoThumbnail = undefined;
        data.videoDuration = undefined;
        data.videoViews = undefined;
      }

      // Handle video-based portfolio
      if (data.portfolioType === 'video') {
        // Video thumbnail upload
        if (files.videoThumbnail && files.videoThumbnail.length > 0) {
          // Delete old thumbnail from Cloudinary
          if (existingItem.videoThumbnail) {
            try {
              const publicId = existingItem.videoThumbnail.split("/").pop().split(".")[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (e) {}
          }
          data.videoThumbnail = files.videoThumbnail[0].path;
        }

        // Clear image fields for video type
        data.image = undefined;
        data.images = undefined;
        data.guests = undefined;
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

      const item = await PortfolioService.update(id, data);

      res.status(200).json({
        success: true,
        message: "Portfolio item updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("Update error:", error);
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
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
      }

      // Delete all images from Cloudinary
      if (item.images && item.images.length > 0) {
        for (const img of item.images) {
          try {
            const publicId = img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {}
        }
      }

      // Delete video thumbnail from Cloudinary
      if (item.videoThumbnail) {
        try {
          const publicId = item.videoThumbnail.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {}
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