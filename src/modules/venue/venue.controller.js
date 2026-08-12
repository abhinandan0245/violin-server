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

  // ✅ Create Venue with JSON data
  static async create(req, res) {
    try {
      console.log("📝 Create Venue Request:");
      console.log("Body:", req.body);
      console.log("File:", req.file ? "✅ Image received" : "❌ No image");

      let data = req.body;

      // ✅ If data is sent as JSON string in 'data' field
      if (req.body.data) {
        try {
          data = JSON.parse(req.body.data);
          console.log("Parsed JSON data:", data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      // ✅ If image uploaded, add Cloudinary URL
      if (req.file) {
        data.image = req.file.path;
      }

      // ✅ Validate required fields
      const requiredFields = [
        "name",
        "location",
        "category",
        "capacity",
        "price",
        "description",
      ];
      const missingFields = requiredFields.filter((field) => !data[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          received: data,
        });
      }

      // ✅ Validate image
      if (!data.image) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      // ✅ Handle amenities - if string, convert to array
      if (data.amenities) {
        if (typeof data.amenities === "string") {
          data.amenities = data.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // ✅ Handle featured
      data.featured = data.featured === "true" || data.featured === true;

      const venue = await VenueService.create(data);

      res.status(201).json({
        success: true,
        message: "Venue created successfully",
        data: venue,
      });
    } catch (error) {
      console.error("❌ Create Venue Error:", error);

      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
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

  // ✅ Update Venue
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

      // ✅ If data is sent as JSON string in 'data' field
      if (req.body.data) {
        try {
          data = JSON.parse(req.body.data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }

      // ✅ If new image uploaded
      if (req.file) {
        // Delete old image from Cloudinary
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
        data.image = req.file.path;
      }

      // ✅ Handle amenities
      if (data.amenities) {
        if (typeof data.amenities === "string") {
          data.amenities = data.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      // ✅ Handle featured
      if (data.featured === "true" || data.featured === true) {
        data.featured = true;
      } else if (data.featured === "false" || data.featured === false) {
        data.featured = false;
      }

      const venue = await VenueService.update(req.params.id, data);

      res.status(200).json({
        success: true,
        message: "Venue updated successfully",
        data: venue,
      });
    } catch (error) {
      console.error("❌ Update Venue Error:", error);

      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
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

  // Delete Venue - Delete images too
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
