// Import express
import express from "express";

// Import controllers
import { registerUser, loginUser } from "../controllers/authController.js";

// Import validations
import { registerValidation } from "../validations/authValidation.js";

// Create router
const router = express.Router();

// Register route
router.post("/register", registerValidation, registerUser);

// Login route
router.post("/login", loginUser);

// Export router
export default router;
