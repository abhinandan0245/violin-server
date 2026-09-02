// src/modules/destination/destination.controller.js
const DestinationService = require("./destination.service");
const cloudinary = require("../../config/cloudinary");

class DestinationController {
  // Get all destinations (Public)
  static async getAll(req, res) {
    try {
      // 1. Extract query parameters from the request
      const { country, state, city, category, page, limit } = req.query;

      // 2. Package them into a filters object
      const filters = {
        country,
        state,
        city,
        category,
        page: parseInt(page) || 1, // Default to page 1
        limit: parseInt(limit) || 100, // Default to 100 items
      };

      // 3. Call the service layer with the filters
      const result = await DestinationService.getAll(filters);

      // 4. Send the successful response to the frontend
      res.status(200).json({
        success: true,
        data: result, // This will contain { destinations, total, page, totalPages, limit }
      });
    } catch (error) {
      console.error("❌ Get All Destinations Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch destinations",
      });
    }
  }

  // Get featured destinations (Public)
  static async getFeatured(req, res) {
    try {
      const destinations = await DestinationService.getFeatured();
      res.status(200).json({
        success: true,
        data: destinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single destination (Public)
  static async getById(req, res) {
    try {
      const destination = await DestinationService.getById(req.params.id);
      if (!destination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found",
        });
      }
      res.status(200).json({
        success: true,
        data: destination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // src/modules/destination/destination.controller.js
  // Replace the create method with this:
  static async create(req, res) {
    try {
      console.log("📝 Create Destination Request:");
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Body:", req.body);
      console.log("Files:", req.files ? Object.keys(req.files) : "No image");

      // Check if it's bulk create
      let isBulk = false;
      let destinationsData = null;

      if (req.body.destinations && Array.isArray(req.body.destinations)) {
        destinationsData = req.body.destinations;
        isBulk = true;
        console.log(
          `🔄 Bulk create with ${destinationsData.length} destinations`,
        );
      }

      // Handle Bulk Create (unchanged — no file support here)
      if (isBulk && destinationsData) {
        const createdDestinations = [];
        const errors = [];

        for (let i = 0; i < destinationsData.length; i++) {
          try {
            const data = destinationsData[i];

            if (data.tags) {
              if (typeof data.tags === "string") {
                data.tags = data.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean);
              } else if (!Array.isArray(data.tags)) {
                data.tags = [];
              }
            } else {
              data.tags = [];
            }

            data.featured = data.featured === true || data.featured === "true";

            Object.keys(data).forEach((key) => {
              if (
                data[key] === "" ||
                data[key] === null ||
                data[key] === undefined
              ) {
                delete data[key];
              }
            });

            if (Object.keys(data).length > 0 && data.country) {
              const destination = await DestinationService.create(data);
              createdDestinations.push(destination);
            } else {
              errors.push({
                index: i,
                message: "No data provided or missing country field",
              });
            }
          } catch (error) {
            console.error(`Error creating destination ${i + 1}:`, error);
            errors.push({ index: i, message: error.message });
          }
        }

        if (createdDestinations.length === 0) {
          return res.status(400).json({
            success: false,
            message:
              "Failed to create any destinations. Please fill in at least one destination with required fields.",
            errors: errors,
          });
        }

        return res.status(201).json({
          success: true,
          message: `${createdDestinations.length} destinations created successfully`,
          data: createdDestinations,
          errors: errors.length > 0 ? errors : undefined,
        });
      }

      // Handle Single Create
      console.log("📦 Processing single destination create");
      const data = req.body;

      // Files come as object-shaped req.files now
      if (req.files?.image?.[0]) {
        data.image = req.files.image[0].path;
      }
      if (req.files?.bannerImage?.[0]) {
        data.bannerImage = req.files.bannerImage[0].path;
      }

      if (data.tags) {
        if (typeof data.tags === "string") {
          data.tags = data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        } else if (!Array.isArray(data.tags)) {
          data.tags = [];
        }
      } else {
        data.tags = [];
      }

      data.featured = data.featured === true || data.featured === "true";

      Object.keys(data).forEach((key) => {
        if (data[key] === "" || data[key] === null || data[key] === undefined) {
          delete data[key];
        }
      });

      if (Object.keys(data).length === 0 || !data.country) {
        // Rollback any uploaded images
        if (req.files?.image?.[0]) {
          try {
            await cloudinary.uploader.destroy(req.files.image[0].filename);
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        }
        if (req.files?.bannerImage?.[0]) {
          try {
            await cloudinary.uploader.destroy(
              req.files.bannerImage[0].filename,
            );
          } catch (err) {
            console.error("Error deleting banner image:", err);
          }
        }
        return res.status(400).json({
          success: false,
          message: "Please provide at least a country to create a destination",
        });
      }

      const destination = await DestinationService.create(data);

      res.status(201).json({
        success: true,
        message: "Destination created successfully",
        data: destination,
      });
    } catch (error) {
      console.error("❌ Create Destination Error:", error);

      if (req.files?.image?.[0]) {
        try {
          await cloudinary.uploader.destroy(req.files.image[0].filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      if (req.files?.bannerImage?.[0]) {
        try {
          await cloudinary.uploader.destroy(req.files.bannerImage[0].filename);
        } catch (err) {
          console.error("Error deleting banner image:", err);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to create destination",
      });
    }
  }
  // Update destination with Country, State, City
  static async update(req, res) {
    try {
      const existingDestination = await DestinationService.getById(
        req.params.id,
      );

      if (!existingDestination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found",
        });
      }

      const data = req.body;

      // New main image uploaded
      if (req.files?.image?.[0]) {
        if (existingDestination.image) {
          try {
            const publicId = existingDestination.image
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/destinations/${publicId}`,
            );
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
        data.image = req.files.image[0].path;
      }

      // New banner image uploaded
      if (req.files?.bannerImage?.[0]) {
        if (existingDestination.bannerImage) {
          try {
            const publicId = existingDestination.bannerImage
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/destinations/${publicId}`,
            );
          } catch (err) {
            console.error("Error deleting old banner image:", err);
          }
        }
        data.bannerImage = req.files.bannerImage[0].path;
      }

      if (data.tags && typeof data.tags === "string") {
        data.tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      if (data.featured === "true" || data.featured === true) {
        data.featured = true;
      } else if (data.featured === "false" || data.featured === false) {
        data.featured = false;
      }

      const destination = await DestinationService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: "Destination updated successfully",
        data: destination,
      });
    } catch (error) {
      console.error("Update Destination Error:", error);

      if (req.files?.image?.[0]) {
        try {
          await cloudinary.uploader.destroy(req.files.image[0].filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      if (req.files?.bannerImage?.[0]) {
        try {
          await cloudinary.uploader.destroy(req.files.bannerImage[0].filename);
        } catch (err) {
          console.error("Error deleting banner image:", err);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to update destination",
      });
    }
  }

  // Delete destination (Admin only) - Delete images too
  static async delete(req, res) {
    try {
      const destination = await DestinationService.getById(req.params.id);

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found",
        });
      }

      // Delete main image
      if (destination.image) {
        const publicId = destination.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `violin-events/destinations/${publicId}`,
        );
      }

      // Delete banner image
      if (destination.bannerImage) {
        const publicId = destination.bannerImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `violin-events/destinations/${publicId}`,
        );
      }

      await DestinationService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Destination deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete main image only
  static async deleteImage(req, res) {
    try {
      const destination = await DestinationService.getById(req.params.id);
      if (!destination) {
        return res
          .status(404)
          .json({ success: false, message: "Destination not found" });
      }

      if (destination.image) {
        try {
          const publicId = destination.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/destinations/${publicId}`,
          );
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
        }
      }

      const updated = await DestinationService.update(req.params.id, {
        image: "",
      });

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: updated,
      });
    } catch (error) {
      console.error("❌ Delete Image Error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: error.message || "Failed to delete image",
        });
    }
  }

  // Delete banner image only
  static async deleteBannerImage(req, res) {
    try {
      const destination = await DestinationService.getById(req.params.id);
      if (!destination) {
        return res
          .status(404)
          .json({ success: false, message: "Destination not found" });
      }

      if (destination.bannerImage) {
        try {
          const publicId = destination.bannerImage
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/destinations/${publicId}`,
          );
        } catch (err) {
          console.error("Error deleting banner image from Cloudinary:", err);
        }
      }

      const updated = await DestinationService.update(req.params.id, {
        bannerImage: "",
      });

      res.status(200).json({
        success: true,
        message: "Banner image deleted successfully",
        data: updated,
      });
    } catch (error) {
      console.error("❌ Delete Banner Image Error:", error);
      res
        .status(500)
        .json({
          success: false,
          message: error.message || "Failed to delete banner image",
        });
    }
  }
}

module.exports = DestinationController;
