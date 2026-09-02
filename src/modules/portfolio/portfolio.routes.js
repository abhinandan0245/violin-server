const express = require("express");
const router = express.Router();
const PortfolioController = require("./portfolio.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.get("/", PortfolioController.getAll);
router.get("/featured", PortfolioController.getFeatured);
router.get("/videos", PortfolioController.getVideos);
router.get("/images", PortfolioController.getImages);
router.get("/:id", PortfolioController.getById);

// Admin routes with multiple file uploads
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },          // Main image for image portfolio
    { name: "images", maxCount: 10 },        // Additional images for image portfolio
    { name: "videoThumbnail", maxCount: 1 }, // Video thumbnail for video portfolio
  ]),
  PortfolioController.create,
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "videoThumbnail", maxCount: 1 },
  ]),
  PortfolioController.update,
);

router.delete("/:id", protect, PortfolioController.delete);

module.exports = router;