// src/modules/journal/journal.routes.js
const express = require("express");
const router = express.Router();
const JournalController = require("./journal.controller");
const { protect } = require("../../middleware/auth");
const {upload} = require("../../config/multer");

// Public routes
router.get("/", JournalController.getAll);
router.get("/featured", JournalController.getFeatured);
router.get("/categories", JournalController.getCategories);
router.get("/:id", JournalController.getById);

// Admin routes (Protected)
router.get("/admin/stats", protect, JournalController.getStats);
router.post("/", protect, upload.single("image"), JournalController.create);
router.put("/:id", protect, upload.single("image"), JournalController.update);
router.delete("/:id", protect, JournalController.delete);

module.exports = router;
