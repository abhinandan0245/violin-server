const app = require("./src/app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("🛑 Server shut down gracefully");
  process.exit(0);
});



// const app = require("./src/app");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const path = require("path");

// // Load environment variables
// dotenv.config();

// // If in production, also try loading from .env.production
// if (process.env.NODE_ENV === "production") {
//   dotenv.config({ path: path.join(__dirname, ".env.production") });
// }

// const PORT = process.env.PORT || 5000;

// // Log environment
// console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
// console.log(
//   `📡 MongoDB URI: ${process.env.MONGODB_URI ? "✅ Set" : "❌ Not Set"}`,
// );

// // ============================================
// // MONGODB CONNECTION - FIXED (v4+ compatible)
// // ============================================

// // ✅ REMOVED: useNewUrlParser and useUnifiedTopology
// // These options are deprecated in Mongoose v7+
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     serverSelectionTimeoutMS: 5000,
//     socketTimeoutMS: 45000,
//   })
//   .then(() => {
//     console.log("✅ MongoDB Connected Successfully");
//     console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📚 Health Check: http://localhost:${PORT}/api/health`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     console.error("💡 Please check your MONGODB_URI in .env file");
//     process.exit(1);
//   });

// // Graceful shutdown
// process.on("SIGINT", async () => {
//   console.log("🛑 Received SIGINT. Closing connections...");
//   await mongoose.disconnect();
//   console.log("✅ MongoDB disconnected");
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   console.log("🛑 Received SIGTERM. Closing connections...");
//   await mongoose.disconnect();
//   console.log("✅ MongoDB disconnected");
//   process.exit(0);
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error("❌ Uncaught Exception:", err);
//   process.exit(1);
// });

// // Handle unhandled rejections
// process.on("unhandledRejection", (err) => {
//   console.error("❌ Unhandled Rejection:", err);
//   process.exit(1);
// });