const express = require("express");
const router = express.Router();
const DestinationController = require("./destination.controller");
const { protect } = require("../../middleware/auth");
const {upload} = require("../../config/multer");

// Public routes (Frontend will use these)
router.get("/", DestinationController.getAll);
router.get("/featured", DestinationController.getFeatured);
router.get("/:id", DestinationController.getById);

// Admin routes (Protected) - With Image Upload

// Single image upload - use 'image' field
router.post("/", protect, upload.single("image"), DestinationController.create);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  DestinationController.update,
);
router.delete("/:id", protect, DestinationController.delete);

// For multiple images (optional)
// router.post("/", protect, upload.array("images", 5), DestinationController.create);
// router.put("/:id", protect, upload.array("images", 5), DestinationController.update);

module.exports = router;
