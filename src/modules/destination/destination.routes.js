// src/modules/destination/destination.routes.js
const express = require("express");
const router = express.Router();
const DestinationController = require("./destination.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

const destinationUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

// Public routes
router.get("/", DestinationController.getAll);
router.get("/featured", DestinationController.getFeatured);
router.get("/:id", DestinationController.getById);

// Admin routes (Protected)
router.post("/", protect, destinationUpload, DestinationController.create);
router.put("/:id", protect, destinationUpload, DestinationController.update);
router.delete("/:id", protect, DestinationController.delete);
router.delete("/:id/image", protect, DestinationController.deleteImage);
router.delete(
  "/:id/banner-image",
  protect,
  DestinationController.deleteBannerImage,
);

module.exports = router;
