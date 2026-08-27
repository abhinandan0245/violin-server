const jwt = require("jsonwebtoken");
const Admin = require("../modules/admin/admin.model");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.name, error.message); // <-- add this
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please log in again",
        code: "TOKEN_EXPIRED",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
