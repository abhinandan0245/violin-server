const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const AdminController = require("./admin.controller");
const { protect } = require("../../middleware/auth");
const upload = require("../../config/multer");

// Public routes
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  AdminController.register,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AdminController.login,
);

// Protected routes
router.get("/me", protect, AdminController.getMe);

// Update profile (name, email) with optional image
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  AdminController.updateProfile,
);

// Update profile image only
router.put(
  "/profile/image",
  protect,
  upload.single("profileImage"),
  AdminController.updateProfileImage,
);

// Delete profile image
router.delete("/profile/image", protect, AdminController.deleteProfileImage);

module.exports = router;
