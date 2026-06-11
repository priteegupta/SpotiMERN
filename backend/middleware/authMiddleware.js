// Import JWT package
import jwt from "jsonwebtoken";

// Authentication Middleware
const protect = (req, res, next) => {
  try {
    // Get token from request header
    let token = req.headers.authorization;

    // If token missing
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Support Bearer standard header
    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user info in request
    req.user = decoded;

    // Move to next middleware/controller
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: error.message,
    });
  }
};

export default protect;
