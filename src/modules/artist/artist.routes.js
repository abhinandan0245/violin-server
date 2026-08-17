const express = require("express");
const router = express.Router();
const ArtistController = require("./artist.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// ✅ Public routes
router.get("/", ArtistController.getAll);
router.get("/featured", ArtistController.getFeatured);
router.get("/category/:categoryId", ArtistController.getByCategory);
router.get("/:id", ArtistController.getById);

// ✅ Admin routes
router.post("/", protect, upload.single("image"), ArtistController.create);

router.put("/:id", protect, upload.single("image"), ArtistController.update);

router.patch("/:id/toggle-featured", protect, ArtistController.toggleFeatured);

router.patch("/:id/toggle-status", protect, ArtistController.toggleStatus);

router.delete("/:id", protect, ArtistController.delete);

router.delete("/bulk-delete", protect, ArtistController.bulkDelete);

module.exports = router;
