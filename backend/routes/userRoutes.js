import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { getAllUsers, deleteUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { profileValidation } from "../validations/userValidation.js";

const router = express.Router();

// User management (Admin only)
router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

// Profile Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, profileValidation, updateUserProfile);

export default router;
