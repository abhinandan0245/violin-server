// src/modules/contact/contact.routes.js
const express = require("express");
const router = express.Router();
const ContactController = require("./contact.controller");
const { protect } = require("../../middleware/auth");

// Public routes
router.post("/", ContactController.create);

// Admin routes (Protected)
router.get("/", protect, ContactController.getAll);
router.get("/stats", protect, ContactController.getStats);
router.get("/:id", protect, ContactController.getById);
router.put("/:id", protect, ContactController.update);
router.delete("/:id", protect, ContactController.delete);

module.exports = router;
