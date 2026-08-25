// src/modules/venue/venue.controller.js
const VenueService = require("./venue.service");
const cloudinary = require("../../config/cloudinary");

class VenueController {
  static async getAll(req, res) {
    try {
      const result = await VenueService.getAll(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getFeatured(req, res) {
    try {
      const venues = await VenueService.getFeatured();
      res.status(200).json({ success: true, data: venues });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const venue = await VenueService.getById(req.params.id);
      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }
      res.status(200).json({ success: true, data: venue });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ CREATE - Multiple Images (min 1, max 5)
 // In the create method, remove the required fields validation
static async create(req, res) {
  try {
    console.log("📝 Create Venue Request:");
    console.log("Body:", req.body);
    console.log(
      "Files:",
      req.files ? `${req.files.length} images received` : "❌ No images",
    );

    let data = req.body;

    // Parse JSON data if sent as string
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
        console.log("Parsed JSON data:", data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }

    // ✅ Check if images are provided
    if (req.files && req.files.length > 0) {
      // Set first image as main image
      data.image = req.files[0].path;
      data.images = req.files.map((file) => file.path);
      console.log(`✅ ${req.files.length} images uploaded`);
    } else {
      // No images uploaded, set to empty or null
      data.image = null;
      data.images = [];
      console.log("ℹ️ No images uploaded");
    }

    // ❌ REMOVE THIS VALIDATION BLOCK
    // const requiredFields = [
    //   "name",
    //   "location",
    //   "category",
    //   "capacity",
    //   "description",
    // ];
    // const missingFields = requiredFields.filter((field) => !data[field]);
    // if (missingFields.length > 0) {
    //   // Clean up uploaded files if validation fails
    //   if (req.files) {
    //     for (const file of req.files) {
    //       try {
    //         await cloudinary.uploader.destroy(file.filename);
    //       } catch (err) {
    //         console.error("Error deleting image:", err);
    //       }
    //     }
    //   }
    //   return res.status(400).json({
    //     success: false,
    //     message: `Missing required fields: ${missingFields.join(", ")}`,
    //     received: data,
    //   });
    // }

    // Handle amenities
    if (data.amenities) {
      if (typeof data.amenities === "string") {
        data.amenities = data.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    // Handle featured
    data.featured = data.featured === "true" || data.featured === true;

    const venue = await VenueService.create(data);

    const imageCount = req.files ? req.files.length : 0;
    res.status(201).json({
      success: true,
      message: `Venue created successfully with ${imageCount} images`,
      data: venue,
    });
  } catch (error) {
    console.error("❌ Create Venue Error:", error);

    // Clean up uploaded files if error occurs
    if (req.files) {
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
      message: error.message || "Failed to create venue",
    });
  }
}

  // ✅ UPDATE - Multiple Images
  static async update(req, res) {
    try {
      const existingVenue = await VenueService.getById(req.params.id);

      if (!existingVenue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      let data = req.body;

      if (req.body.data) {
        try {
          data = JSON.parse(req.body.data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      // ✅ Handle multiple images
      let newImages = [];
      let hasNewImages = false;

      if (req.files && req.files.length > 0) {
        if (req.files.length > 5) {
          return res.status(400).json({
            success: false,
            message: "Maximum 5 images allowed",
          });
        }

        newImages = req.files.map((file) => file.path);
        hasNewImages = true;
        console.log(`✅ ${req.files.length} new images uploaded`);
      }

      // If new images are uploaded, handle them
      if (hasNewImages) {
        // Check if replaceMainImage flag is set
        if (
          data.replaceMainImage === "true" ||
          data.replaceMainImage === true
        ) {
          // Delete old main image if it exists
          if (existingVenue.image) {
            try {
              const publicId = existingVenue.image
                .split("/")
                .pop()
                .split(".")[0];
              await cloudinary.uploader.destroy(
                `violin-events/venues/${publicId}`,
              );
            } catch (err) {
              console.error("Error deleting old image:", err);
            }
          }
          data.image = newImages[0];
        } else {
          // Keep existing main image, just add new images to gallery
          data.image = existingVenue.image;
        }

        // Add new images to existing images array
        const currentImages = existingVenue.images || [];
        data.images = [...currentImages, ...newImages];
      } else {
        // No new images - keep existing images
        data.image = existingVenue.image;
        data.images = existingVenue.images || [];
      }

      // Handle amenities
      if (data.amenities) {
        if (typeof data.amenities === "string") {
          data.amenities = data.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // Handle featured
      if (data.featured === "true" || data.featured === true) {
        data.featured = true;
      } else if (data.featured === "false" || data.featured === false) {
        data.featured = false;
      }

      const venue = await VenueService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: `Venue updated successfully with ${req.files?.length || 0} new images`,
        data: venue,
      });
    } catch (error) {
      console.error("❌ Update Venue Error:", error);

      // Clean up uploaded files if error occurs
      if (req.files) {
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
        message: error.message || "Failed to update venue",
      });
    }
  }

  // Delete Venue
  static async delete(req, res) {
    try {
      const venue = await VenueService.getById(req.params.id);

      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      // Delete main image from Cloudinary
      if (venue.image) {
        const publicId = venue.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`violin-events/venues/${publicId}`);
      }

      // Delete all images from Cloudinary
      if (venue.images && venue.images.length > 0) {
        for (const img of venue.images) {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`violin-events/venues/${publicId}`);
        }
      }

      await VenueService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Venue deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = VenueController;
