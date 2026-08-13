// // src/config/multer.js
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary");
// const path = require("path");

// // ✅ Check if cloudinary is configured
// if (!cloudinary.config().cloud_name) {
//   console.error("❌ Cloudinary not configured. Please check your .env file");
// }

// // Dynamic folder based on route
// const getFolder = (req) => {
//   if (req.baseUrl.includes("/admin")) return "violin-events/admins";
//   if (req.baseUrl.includes("/destinations"))
//     return "violin-events/destinations";
//   if (req.baseUrl.includes("/venues")) return "violin-events/venues";
//   if (req.baseUrl.includes("/portfolio")) return "violin-events/portfolio";
//   return "violin-events/general";
// };

// // Dynamic transformation based on route
// const getTransformation = (req) => {
//   if (req.baseUrl.includes("/admin")) {
//     return [{ width: 400, height: 400, crop: "limit" }, { quality: "auto" }];
//   }
//   if (
//     req.baseUrl.includes("/destinations") ||
//     req.baseUrl.includes("/venues") ||
//     req.baseUrl.includes("/portfolio")
//   ) {
//     return [{ width: 1200, height: 800, crop: "limit" }, { quality: "auto" }];
//   }
//   return [{ quality: "auto" }];
// };

// // ✅ Cloudinary Storage with error handling
// let storage;
// try {
//   storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: (req, file) => {
//       return {
//         folder: getFolder(req),
//         allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
//         transformation: getTransformation(req),
//       };
//     },
//   });
//   console.log("✅ Cloudinary storage initialized");
// } catch (error) {
//   console.error("❌ Failed to initialize Cloudinary storage:", error.message);
//   // ✅ Fallback to local storage if Cloudinary fails
//   const multer = require("multer");
//   const fs = require("fs");

//   // Create uploads directory if it doesn't exist
//   if (!fs.existsSync("uploads")) {
//     fs.mkdirSync("uploads", { recursive: true });
//   }

//   storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       let folder = "uploads/";
//       if (req.baseUrl.includes("/admin")) folder = "uploads/admins/";
//       else if (req.baseUrl.includes("/destinations"))
//         folder = "uploads/destinations/";
//       else if (req.baseUrl.includes("/venues")) folder = "uploads/venues/";
//       else if (req.baseUrl.includes("/portfolio"))
//         folder = "uploads/portfolio/";

//       if (!fs.existsSync(folder)) {
//         fs.mkdirSync(folder, { recursive: true });
//       }
//       cb(null, folder);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(
//         null,
//         file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
//       );
//     },
//   });
//   console.log("⚠️ Using local storage fallback for uploads");
// }

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase(),
//   );
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
//   }
// };

// // Upload middleware
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter: fileFilter,
// });

// module.exports = upload;


// src/config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const path = require("path");

// ✅ Check if cloudinary is configured
if (!cloudinary.config().cloud_name) {
  console.error("❌ Cloudinary not configured. Please check your .env file");
}

// Dynamic folder based on route
const getFolder = (req) => {
  if (req.baseUrl.includes("/admin")) return "violin-events/admins";
  if (req.baseUrl.includes("/destinations")) return "violin-events/destinations";
  if (req.baseUrl.includes("/venues")) return "violin-events/venues";
  if (req.baseUrl.includes("/portfolio")) return "violin-events/portfolio";
  return "violin-events/general";
};

// Dynamic transformation based on route
const getTransformation = (req) => {
  if (req.baseUrl.includes("/admin")) {
    return [{ width: 400, height: 400, crop: "limit" }, { quality: "auto" }];
  }
  if (
    req.baseUrl.includes("/destinations") ||
    req.baseUrl.includes("/venues") ||
    req.baseUrl.includes("/portfolio")
  ) {
    return [{ width: 1200, height: 800, crop: "limit" }, { quality: "auto" }];
  }
  return [{ quality: "auto" }];
};

// ✅ Cloudinary Storage with error handling
let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      return {
        folder: getFolder(req),
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: getTransformation(req),
      };
    },
  });
  console.log("✅ Cloudinary storage initialized");
} catch (error) {
  console.error("❌ Failed to initialize Cloudinary storage:", error.message);
  // ✅ Fallback to local storage if Cloudinary fails
  const multer = require("multer");
  const fs = require("fs");

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folder = "uploads/";
      if (req.baseUrl.includes("/admin")) folder = "uploads/admins/";
      else if (req.baseUrl.includes("/destinations")) folder = "uploads/destinations/";
      else if (req.baseUrl.includes("/venues")) folder = "uploads/venues/";
      else if (req.baseUrl.includes("/portfolio")) folder = "uploads/portfolio/";

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  });
  console.log("⚠️ Using local storage fallback for uploads");
}

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// ✅ Single image upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// ✅ Multiple image upload middleware (max 5 images)
const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: fileFilter,
}).array("images", 5); // Max 5 images with field name 'images'

module.exports = { upload, uploadMultiple };