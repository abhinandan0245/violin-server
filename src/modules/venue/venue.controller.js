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

  // ✅ ADD GET COUNTRIES ENDPOINT
  static async getCountries(req, res) {
    try {
      const countries = await VenueService.getCountries();
      res.status(200).json({ success: true, data: countries });
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

  static async create(req, res) {
    try {
      let data = req.body;

      if (req.body.data) {
        try {
          data = JSON.parse(req.body.data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      const mainImageFile = req.files?.image?.[0];
      const galleryFiles = req.files?.images || [];

      if (mainImageFile) {
        data.image = mainImageFile.path;
      } else {
        data.image = null;
      }
      data.images = galleryFiles.map((file) => file.path);

      console.log(
        `✅ Main image: ${mainImageFile ? "yes" : "no"}, Gallery: ${galleryFiles.length}`,
      );

      // Parse amenities
      if (data.amenities && typeof data.amenities === "string") {
        data.amenities = data.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      // Parse featured
      data.featured = data.featured === "true" || data.featured === true;

      // ✅ ENSURE COUNTRY IS SET
      if (!data.country) {
        data.country = "";
      }

      const venue = await VenueService.create(data);

      res.status(201).json({
        success: true,
        message: `Venue created successfully with ${(mainImageFile ? 1 : 0) + galleryFiles.length} images`,
        data: venue,
      });
    } catch (error) {
      console.error("❌ Create Venue Error:", error);

      const allFiles = [
        ...(req.files?.image || []),
        ...(req.files?.images || []),
      ];
      for (const file of allFiles) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to create venue",
      });
    }
  }

  static async update(req, res) {
    try {
      const existingVenue = await VenueService.getById(req.params.id);
      if (!existingVenue) {
        return res
          .status(404)
          .json({ success: false, message: "Venue not found" });
      }

      let data = req.body;
      if (req.body.data) {
        try {
          data = JSON.parse(req.body.data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      const mainImageFile = req.files?.image?.[0];
      const galleryFiles = req.files?.images || [];

      if (galleryFiles.length > 5) {
        return res
          .status(400)
          .json({ success: false, message: "Maximum 5 images allowed" });
      }

      // Main image: new upload replaces old one
      if (mainImageFile) {
        if (existingVenue.image) {
          try {
            const publicId = existingVenue.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(
              `violin-events/venues/${publicId}`,
            );
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
        data.image = mainImageFile.path;
      } else {
        data.image = existingVenue.image;
      }

      // Gallery: new files append to existing
      if (galleryFiles.length > 0) {
        const currentImages = existingVenue.images || [];
        data.images = [...currentImages, ...galleryFiles.map((f) => f.path)];
      } else {
        data.images = existingVenue.images || [];
      }

      // Parse amenities
      if (data.amenities && typeof data.amenities === "string") {
        data.amenities = data.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }

      // Parse featured
      data.featured = data.featured === "true" || data.featured === true;

      // ✅ KEEP EXISTING COUNTRY IF NOT PROVIDED
      if (!data.country) {
        data.country = existingVenue.country || "";
      }

      const venue = await VenueService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: `Venue updated successfully with ${galleryFiles.length} new images`,
        data: venue,
      });
    } catch (error) {
      console.error("❌ Update Venue Error:", error);

      const allFiles = [
        ...(req.files?.image || []),
        ...(req.files?.images || []),
      ];
      for (const file of allFiles) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message || "Failed to update venue",
      });
    }
  }

  static async delete(req, res) {
    try {
      const venue = await VenueService.getById(req.params.id);

      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      if (venue.image) {
        const publicId = venue.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`violin-events/venues/${publicId}`);
      }

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