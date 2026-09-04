// // src/modules/contact/contact.model.js
// const mongoose = require("mongoose");

// const contactSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       trim: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },
//     phone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       trim: true,
//     },
//     guests: {
//       type: String,
//       trim: true,
//     },
//     // REMOVED "destination" — replaced by venueName / country / state / city / category below
//     venueName: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     country: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     state: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     city: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     category: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     celebrationType: {
//       type: String,
//       trim: true,
//     },
//     message: {
//       type: String,
//       required: [true, "Message is required"],
//       trim: true,
//       maxlength: [1000, "Message cannot exceed 1000 characters"],
//     },
//     status: {
//       type: String,
//       enum: ["pending", "read", "replied"],
//       default: "pending",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Contact", contactSchema);

// src/modules/contact/contact.model.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // 1. User Details
    user: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },

    // 2. Helper field for easy admin filtering (e.g., ["general", "venue"])
    enquiryTypes: [{
      type: String,
      enum: ["general", "venue", "artist", "event"]
    }],

    // 3. Dynamic Enquiry Sections
    enquiries: {
      general: {
        comment: { type: String, trim: true },
      },
      venue: {
        country: { type: String, trim: true },
        state: { type: String, trim: true },
        city: { type: String, trim: true },
        venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
        venueName: { type: String, trim: true },
        bookingDate: { type: Date },
        additionalDetails: { type: String, trim: true },
      },
      artist: {
        eventType: { type: String, trim: true },
        eventDate: { type: Date },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "ArtistCategory" },
        categoryName: { type: String, trim: true },
        selectedArtistIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
        additionalDetails: { type: String, trim: true },
      },
      event: {
        eventType: { type: String, trim: true },
        eventDate: { type: Date },
        guestCount: { type: String, trim: true },
        location: { type: String, trim: true },
        budgetRange: { type: String, trim: true },
        additionalDetails: { type: String, trim: true },
      },
    },

    // 4. Meta Data
    status: {
      type: String,
      enum: ["pending", "read", "replied"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);