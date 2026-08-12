// src/modules/admin/admin.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, "Name is required"],

      trim: true,
    },

    email: {
      type: String,

      required: [true, "Email is required"],

      unique: true,

      lowercase: true,

      trim: true,
    },

    password: {
      type: String,

      required: [true, "Password is required"],

      minlength: [6, "Password must be at least 6 characters"],

      select: false,
    },

    profileImage: {
      type: String,

      default: "",
    },

    phone: {
      type: String,

      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [200, "Bio must be at most 200 characters"],
      default: "",
    },

    // Address field add kiya

    address: {
      street: { type: String, trim: true, default: "" },

      city: { type: String, trim: true, default: "" },

      state: { type: String, trim: true, default: "" },

      pincode: { type: String, trim: true, default: "" },

      country: { type: String, trim: true, default: "India" },
    },

    role: {
      type: String,

      enum: ["superadmin", "admin", "moderator"],

      default: "admin",
    },

    isActive: {
      type: Boolean,

      default: true,
    },

    lastLogin: {
      type: Date,
    },

    refreshToken: {
      type: String,

      select: false,
    },
  },

  {
    timestamps: true,
  },
);

//  Fixed: Hash password - Modern approach
adminSchema.pre("save", async function () { 
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
