const express = require("express");
const router = express.Router();
const PortfolioPageController = require("./portfolioPage.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes - ALWAYS return data
router.get("/", PortfolioPageController.getPage);
router.get("/page-images", PortfolioPageController.getImages);

// Admin routes with multiple image uploads
const uploadFields = upload.fields([
  { name: "heroBanner", maxCount: 1 },
  { name: "footerBanner", maxCount: 1 },
  { name: "centerImageMain", maxCount: 1 },
  { name: "centerImage1", maxCount: 1 },
  { name: "centerImage2", maxCount: 1 },
  { name: "centerImage3", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// ✅ PUT will create if not exists, update if exists
router.put("/", protect, uploadFields, PortfolioPageController.updatePage);
router.delete(
  "/image/:imageType",
  protect,
  PortfolioPageController.deleteImage,
);

module.exports = router;