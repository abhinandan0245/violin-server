const express = require("express");
const router = express.Router();
const PortfolioController = require("./portfolio.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.get("/", PortfolioController.getAll);
router.get("/featured", PortfolioController.getFeatured);
router.get("/videos", PortfolioController.getVideos);
router.get("/:id", PortfolioController.getById);

// ✅ Admin routes with multiple image uploads
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 }, // Main image
    { name: "images", maxCount: 10 }, // Additional images
  ]),
  PortfolioController.create,
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  PortfolioController.update,
);

router.delete("/:id", protect, PortfolioController.delete);

module.exports = router;
