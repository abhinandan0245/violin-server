module.exports = {
  // Admin Roles
  ADMIN_ROLES: {
    ADMIN: "admin",
    SUPER_ADMIN: "superadmin",
  },

  // Destination Categories
  DESTINATION_CATEGORIES: [
    "Royal Heritage",
    "Beach & Luxury",
    "Backwaters & Traditions",
    "Mountains & Serenity",
    "Hills & Spirituality",
    "Scenic Beauty",
  ],

  // Venue Categories
  VENUE_CATEGORIES: [
    "Palaces",
    "Resorts",
    "Beachfront",
    "Heritage",
    "Family & Gardens",
    "City Hotels",
  ],

  // Portfolio Categories
  PORTFOLIO_CATEGORIES: [
    "Weddings",
    "Destination Weddings",
    "Pre-Wedding",
    "Memorial & Nolla",
    "Sangeet",
    "Reception",
    "Corporate Events",
    "Social Events",
  ],

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
