const PortfolioPageService = require("./portfolioPage.service");
const cloudinary = require("../../config/cloudinary");

class PortfolioPageController {
  // ✅ Get portfolio page - ALWAYS returns data
  static async getPage(req, res) {
    try {
      const page = await PortfolioPageService.getPage();
      res.status(200).json({
        success: true,
        data: page,
      });
    } catch (error) {
      console.error("Error fetching portfolio page:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Get images only - ALWAYS returns data
  static async getImages(req, res) {
    try {
      const images = await PortfolioPageService.getImages();
      res.status(200).json({
        success: true,
        data: images,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Update portfolio page images - Creates if not exists, Updates if exists
  static async updatePage(req, res) {
    try {
      // Get existing page first (will create if none exists)
      const existingPage = await PortfolioPageService.getPage();
      const data = req.body;

      console.log("📸 Files received:", Object.keys(req.files || {}));

      // Handle all image fields
      const imageFields = [
        "heroBanner",
        "footerBanner",
        "centerImageMain",
        "centerImage1",
        "centerImage2",
        "centerImage3",
      ];

      // Process single image fields
      for (const field of imageFields) {
        if (req.files && req.files[field] && req.files[field].length > 0) {
          // Delete old image from Cloudinary if it exists
          if (existingPage[field]) {
            try {
              const oldPublicId = existingPage[field]
                .split("/")
                .pop()
                .split(".")[0];
              await cloudinary.uploader.destroy(
                `violin-events/portfolio-page/${oldPublicId}`,
              );
            } catch (e) {
              console.warn(`Could not delete old ${field} image:`, e.message);
            }
          }
          data[field] = req.files[field][0].path;
        }
      }

      // Handle gallery images (multiple)
      if (req.files && req.files.images && req.files.images.length > 0) {
        const replaceImages =
          data.replaceImages === "true" || data.replaceImages === true;

        if (replaceImages) {
          // Delete all old gallery images
          if (existingPage.images && existingPage.images.length > 0) {
            for (const img of existingPage.images) {
              try {
                const publicId = img.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(
                  `violin-events/portfolio-page/${publicId}`,
                );
              } catch (e) {
                console.warn("Could not delete old gallery image:", e.message);
              }
            }
          }
          data.images = req.files.images.map((file) => file.path);
        } else {
          // Append new images to existing
          const currentImages = existingPage.images || [];
          const newImages = req.files.images.map((file) => file.path);
          data.images = [...currentImages, ...newImages];
        }
      }

      // Update the page (will create if doesn't exist)
      const page = await PortfolioPageService.updatePage(data);

      res.status(200).json({
        success: true,
        message: "Portfolio page updated successfully",
        data: page,
      });
    } catch (error) {
      console.error("Error updating portfolio page:", error);

      // Clean up uploaded files if error occurs
      if (req.files) {
        for (const key in req.files) {
          for (const file of req.files[key]) {
            try {
              await cloudinary.uploader.destroy(file.filename);
            } catch (e) {
              console.warn("Could not delete uploaded file:", e.message);
            }
          }
        }
      }

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Delete specific image
  static async deleteImage(req, res) {
    try {
      const { imageType } = req.params;
      const page = await PortfolioPageService.getPage();

      const validFields = [
        "heroBanner",
        "footerBanner",
        "centerImageMain",
        "centerImage1",
        "centerImage2",
        "centerImage3",
      ];

      if (!validFields.includes(imageType) && imageType !== "gallery") {
        return res.status(400).json({
          success: false,
          message: "Invalid image type",
        });
      }

      let imageUrl = null;

      if (imageType === "gallery") {
        const { index } = req.query;
        if (index === undefined || !page.images || !page.images[index]) {
          return res.status(400).json({
            success: false,
            message: "Invalid gallery image index",
          });
        }
        imageUrl = page.images[index];
        page.images.splice(index, 1);
      } else {
        imageUrl = page[imageType];
        page[imageType] = null;
      }

      if (imageUrl) {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/portfolio-page/${publicId}`,
          );
        } catch (e) {
          console.warn("Could not delete image from Cloudinary:", e.message);
        }
      }

      await page.save();

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: page,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PortfolioPageController;
