  const AdminService = require("./admin.service");
  const { validationResult } = require("express-validator");
  const cloudinary = require("../../config/cloudinary");

  class AdminController {
    // Register admin
    static async register(req, res) {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }

        const { name, email, password } = req.body;

        const existingAdmin = await AdminService.findByEmail(email);
        if (existingAdmin) {
          return res.status(400).json({
            success: false,
            message: "Admin already exists",
          });
        }

        const { admin, token } = await AdminService.register({
          name,
          email,
          password,
        });

        res.status(201).json({
          success: true,
          message: "Admin registered successfully",
          token,
          data: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    // Login admin
    static async login(req, res) {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: "Please provide email and password",
          });
        }

        const admin = await AdminService.findByEmail(email);
        if (!admin) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        const token = AdminService.generateToken(admin._id);

        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          data: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            profileImage: admin.profileImage,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    // Get current admin
    static async getMe(req, res) {
      try {
        const admin = await AdminService.findById(req.admin.id);
        res.status(200).json({
          success: true,
          data: admin,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    static async updateProfile(req, res) {
      try {
        const { name, email, phone , bio} = req.body;
        const updateData = {};

        // Only update fields that are provided
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (bio) updateData.bio = bio;

        // Handle address — multer sends bracket-notation keys flat,
        // e.g. req.body["address[city]"], not a nested object.
        const addressKeys = ["street", "city", "state", "pincode"];
        const address = {};
        let hasAddress = false;

        addressKeys.forEach((key) => {
          const bracketKey = `address[${key}]`;
          if (req.body[bracketKey] !== undefined) {
            address[key] = req.body[bracketKey];
            hasAddress = true;
          } else if (req.body.address && req.body.address[key] !== undefined) {
            // fallback in case body-parser already nested it (e.g. non-multipart JSON request)
            address[key] = req.body.address[key];
            hasAddress = true;
          }
        });

        if (hasAddress) {
          updateData.address = address;
        }

        // Handle file upload
        let file = req.file;

        // If file uploaded, handle it in service
        const admin = await AdminService.update(req.admin.id, updateData, file);

        // Return updated admin data
        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone || "",
            bio: admin.bio || "",
            address: admin.address || {},
            profileImage: admin.profileImage || "",
          },
        });
      } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to update profile",
        });
      }
    }

    // ✅ Update profile image only
    static async updateProfileImage(req, res) {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Please upload an image",
          });
        }

        const admin = await AdminService.update(req.admin.id, {}, req.file);

        res.status(200).json({
          success: true,
          message: "Profile image updated successfully",
          data: {
            profileImage: admin.profileImage,
          },
        });
      } catch (error) {
        console.error("Update Profile Image Error:", error);
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }

    // Delete profile image
    static async deleteProfileImage(req, res) {
      try {
        const admin = await AdminService.findById(req.admin.id);

        if (!admin.profileImage) {
          return res.status(400).json({
            success: false,
            message: "No profile image to delete",
          });
        }

        // Delete from Cloudinary
        const publicId = admin.profileImage.split("/").pop().split(".")[0];
        const fullPublicId = `violin-events/admins/${publicId}`;
        await cloudinary.uploader.destroy(fullPublicId);

        // Remove from database
        admin.profileImage = "";
        await admin.save();

        res.status(200).json({
          success: true,
          message: "Profile image deleted successfully",
          data: {
            profileImage: "",
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  }

  module.exports = AdminController;
