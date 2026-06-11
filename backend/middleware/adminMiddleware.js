// Admin Authorization Middleware

const adminOnly = (req, res, next) => {
  // Check user role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  // Continue
  next();
};

export default adminOnly;
