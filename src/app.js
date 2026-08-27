const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

// Import module routes
const adminRoutes = require("./modules/admin/admin.routes");
const destinationRoutes = require("./modules/destination/destination.routes");
const venueRoutes = require("./modules/venue/venue.routes");
const portfolioRoutes = require("./modules/portfolio/portfolio.routes");
const contactRoutes = require("./modules/contact/contact.routes");
const journalRoutes = require("./modules/journal/journal.routes");
const portfolioPageRoutes = require("./modules/portfolioPage/portfolioPage.routes");
const artistCategoryRoutes = require("./modules/artistCategory/artistCategory.routes");
const artistRoutes = require("./modules/artist/artist.routes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "http://localhost:5174",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );
// CORS

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/portfolio-page", portfolioPageRoutes);
app.use("/api/artist-categories", artistCategoryRoutes);
app.use("/api/artists", artistRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;



// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const dotenv = require("dotenv");
// const path = require("path");

// // Import routes
// const adminRoutes = require("./modules/admin/admin.routes");
// const destinationRoutes = require("./modules/destination/destination.routes");
// const venueRoutes = require("./modules/venue/venue.routes");
// const portfolioRoutes = require("./modules/portfolio/portfolio.routes");
// const contactRoutes = require("./modules/contact/contact.routes");
// const journalRoutes = require("./modules/journal/journal.routes");
// const portfolioPageRoutes = require("./modules/portfolioPage/portfolioPage.routes");
// const artistCategoryRoutes = require("./modules/artistCategory/artistCategory.routes");
// const artistRoutes = require("./modules/artist/artist.routes");

// // Import middleware
// const errorHandler = require("./middleware/errorHandler");

// dotenv.config();

// const app = express();

// // ============================================
// // PRODUCTION SECURITY CONFIGURATION
// // ============================================

// // Helmet security headers
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },
//     frameguard: {
//       action: "deny",
//     },
//     referrerPolicy: {
//       policy: "strict-origin-when-cross-origin",
//     },
//   }),
// );

// // ============================================
// // CORS CONFIGURATION - PRODUCTION READY
// // ============================================

// const allowedOrigins = [
//   "https://violineventsllp.com",
//   "https://admin.violineventsllp.com",
//   "https://api.violineventsllp.com",
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (
//         allowedOrigins.indexOf(origin) !== -1 ||
//         process.env.NODE_ENV !== "production"
//       ) {
//         callback(null, true);
//       } else {
//         console.warn(`⚠️ CORS blocked: ${origin}`);
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
//     exposedHeaders: ["Content-Range", "X-Content-Range"],
//     maxAge: 86400,
//   }),
// );

// // ============================================
// // BODY PARSERS
// // ============================================

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// // ============================================
// // STATIC FILES
// // ============================================

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ============================================
// // LOGGING
// // ============================================

// if (process.env.NODE_ENV === "production") {
//   app.use((req, res, next) => {
//     const start = Date.now();
//     res.on("finish", () => {
//       const duration = Date.now() - start;
//       console.log(
//         `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
//       );
//     });
//     next();
//   });
// }

// // ============================================
// // HEALTH CHECK
// // ============================================

// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     success: true,
//     status: "OK",
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || "development",
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//   });
// });

// // ============================================
// // API ROUTES
// // ============================================

// app.use("/api/admin", adminRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/venues", venueRoutes);
// app.use("/api/portfolio", portfolioRoutes);
// app.use("/api/contacts", contactRoutes);
// app.use("/api/journal", journalRoutes);
// app.use("/api/portfolio-page", portfolioPageRoutes);
// app.use("/api/artist-categories", artistCategoryRoutes);
// app.use("/api/artists", artistRoutes);

// // ============================================
// // 404 HANDLER
// // ============================================

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// // ============================================
// // GLOBAL ERROR HANDLER
// // ============================================

// app.use(errorHandler);

// module.exports = app;