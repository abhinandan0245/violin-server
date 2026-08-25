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
    console.log("File:", req.file ? " Image received" : " No image");

    // Check if it's bulk create
    let isBulk = false;
    let destinationsData = null;

    // Check if we have destinations in the body
    if (req.body.destinations && Array.isArray(req.body.destinations)) {
      destinationsData = req.body.destinations;
      isBulk = true;
      console.log(
        `🔄 Bulk create with ${destinationsData.length} destinations`,
      );
      console.log("Destinations data:", JSON.stringify(destinationsData, null, 2));
    }

    // Handle Bulk Create
    if (isBulk && destinationsData) {
      const createdDestinations = [];
      const errors = [];

      for (let i = 0; i < destinationsData.length; i++) {
        try {
          const data = destinationsData[i];
          console.log(`Processing destination ${i + 1}:`, data);

          // Handle tags - ensure it's an array
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

          // Handle featured - ensure it's boolean
          data.featured = data.featured === true || data.featured === "true";

          // Remove empty fields to avoid validation issues
          Object.keys(data).forEach(key => {
            if (data[key] === "" || data[key] === null || data[key] === undefined) {
              delete data[key];
            }
          });

          // Only create if there's at least some data
          if (Object.keys(data).length > 0 && data.country) {
            const destination = await DestinationService.create(data);
            createdDestinations.push(destination);
          } else {
            console.log(`Skipping destination ${i + 1} - no data or missing country`);
            errors.push({
              index: i,
              message: "No data provided or missing country field",
            });
          }
        } catch (error) {
          console.error(`Error creating destination ${i + 1}:`, error);
          errors.push({
            index: i,
            message: error.message,
          });
        }
      }

      if (createdDestinations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Failed to create any destinations. Please fill in at least one destination with required fields.",
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

    // If image uploaded, add Cloudinary URL
    if (req.file) {
      data.image = req.file.path;
    }

    // Handle tags
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

    // Handle featured
    data.featured = data.featured === true || data.featured === "true";

    // Remove empty fields
    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    // Only create if there's at least some data
    if (Object.keys(data).length === 0 || !data.country) {
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
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

    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting image:", err);
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

      // If new image uploaded
      if (req.file) {
        // Delete old image from Cloudinary
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
        data.image = req.file.path;
      }

      // Handle tags - convert from string to array if needed
      if (data.tags && typeof data.tags === "string") {
        data.tags = data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }

      // Handle featured - convert from string to boolean
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
      console.error(" Update Destination Error:", error);

      // If error, delete newly uploaded images from Cloudinary
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
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

      // Delete main image from Cloudinary
      if (destination.image) {
        const publicId = destination.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `violin-events/destinations/${publicId}`,
        );
      }

      // Delete all images from Cloudinary
      if (destination.images && destination.images.length > 0) {
        for (const img of destination.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `violin-events/destinations/${publicId}`,
          );
        }
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
}

module.exports = DestinationController;
