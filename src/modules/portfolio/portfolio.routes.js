const express = require("express");
const router = express.Router();
const PortfolioController = require("./portfolio.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.get("/", PortfolioController.getAll);
router.get("/featured", PortfolioController.getFeatured);
router.get("/videos", PortfolioController.getVideos); // New route for videos
router.get("/:id", PortfolioController.getById);

// Admin routes with image upload
// Single image upload - use 'image' field
router.post("/", protect, upload.single("image"), PortfolioController.create);
router.put("/:id", protect, upload.single("image"), PortfolioController.update);
router.delete("/:id", protect, PortfolioController.delete);

// For multiple images (optional)
// router.post("/", protect, upload.array("images", 5), PortfolioController.create);
// router.put("/:id", protect, upload.array("images", 5), PortfolioController.update);

module.exports = router;
