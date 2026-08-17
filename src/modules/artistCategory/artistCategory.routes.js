const express = require("express");
const router = express.Router();
const ArtistCategoryController = require("./artistCategory.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.get("/", ArtistCategoryController.getAll);
router.get("/active", ArtistCategoryController.getActive);
router.get("/slug/:slug", ArtistCategoryController.getBySlug);
router.get("/:id", ArtistCategoryController.getById);

//  Admin routes
router.post(
  "/",
  protect,
  upload.single("image"),
  ArtistCategoryController.create
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  ArtistCategoryController.update
);

router.patch(
  "/:id/toggle-status",
  protect,
  ArtistCategoryController.toggleStatus
);

router.put(
  "/reorder",
  protect,
  ArtistCategoryController.reorder
);

router.delete(
  "/:id",
  protect,
  ArtistCategoryController.delete
);

router.delete(
  "/bulk-delete",
  protect,
  ArtistCategoryController.bulkDelete
);

module.exports = router;