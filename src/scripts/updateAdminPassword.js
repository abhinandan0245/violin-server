const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../modules/admin/admin.model");

dotenv.config();

const EMAIL = "violineventsllp@gmail.com";
const NEW_PASSWORD = "Admin@123456";

async function updateAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const admin = await Admin.findOne({ email: EMAIL }).select("+password");

    if (!admin) {
      console.log("Admin not found:", EMAIL);
      process.exit(1);
    }

    admin.password = NEW_PASSWORD;

    await admin.save();

    console.log("Admin password updated successfully.");
    console.log("Email:", EMAIL);

    process.exit(0);
  } catch (error) {
    console.error("Password update failed:", error.message);
    process.exit(1);
  }
}

updateAdminPassword();