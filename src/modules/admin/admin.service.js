const Admin = require("./admin.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../config/cloudinary");

class AdminService {
  // Generate JWT
  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // Register
  static async register(data) {
    const admin = await Admin.create(data);
    const token = this.generateToken(admin._id);
    return { admin, token };
  }

  // Find by email
  static async findByEmail(email) {
    return await Admin.findOne({ email }).select("+password");
  }

  // Find by id
  static async findById(id) {
    return await Admin.findById(id).select("-password");
  }

  // Update admin (with image handling)
  static async update(id, data, file) {
    // If new image uploaded, delete old image from Cloudinary
    if (file) {
      const admin = await Admin.findById(id);
      if (admin && admin.profileImage) {
        // Extract public_id from Cloudinary URL
        const publicId = admin.profileImage.split("/").pop().split(".")[0];
        const fullPublicId = `violin-events/admins/${publicId}`;

        // Delete old image from Cloudinary
        try {
          await cloudinary.uploader.destroy(fullPublicId);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Set new image URL
      data.profileImage = file.path; // Cloudinary URL
    }

    return await Admin.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  // Get all admins
  static async getAll() {
    return await Admin.find().select("-password");
  }

  // Delete admin (with image)
  static async delete(id) {
    const admin = await Admin.findById(id);
    if (admin && admin.profileImage) {
      // Delete image from Cloudinary
      const publicId = admin.profileImage.split("/").pop().split(".")[0];
      const fullPublicId = `violin-events/admins/${publicId}`;
      try {
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    return await Admin.findByIdAndDelete(id);
  }
}

module.exports = AdminService;
