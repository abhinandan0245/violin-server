const express = require("express");
const router = express.Router();
const VenueController = require("./venue.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer"); // ✅ Import venueUpload

// Public routes
router.get("/", VenueController.getAll);
router.get("/featured", VenueController.getFeatured);
router.get("/:id", VenueController.getById);

// Admin routes with image upload

// ✅ Single route for multiple images (min 1, max 5)
router.post("/", protect, upload.array("images", 5), VenueController.create);
router.put("/:id", protect, upload.array("images", 5), VenueController.update);
router.delete("/:id", protect, VenueController.delete);

// For multiple images (optional)
// router.post("/", protect, upload.array("images", 5), VenueController.create);
// router.put("/:id", protect, upload.array("images", 5), VenueController.update);

module.exports = router;
