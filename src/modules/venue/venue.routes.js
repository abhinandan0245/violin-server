const express = require("express");
const router = express.Router();
const VenueController = require("./venue.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.get("/", VenueController.getAll);
router.get("/countries", VenueController.getCountries);
router.get("/featured", VenueController.getFeatured);
router.get("/:id", VenueController.getById);

// Admin routes with image upload

// Single route for multiple images (min 1, max 5)
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

router.post("/", protect, uploadFields, VenueController.create);
router.put("/:id", protect, uploadFields, VenueController.update);
router.delete("/:id", protect, VenueController.delete);

// For multiple images (optional)
// router.post("/", protect, upload.array("images", 5), VenueController.create);
// router.put("/:id", protect, upload.array("images", 5), VenueController.update);

module.exports = router;
