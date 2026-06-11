import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  createSong,
  getAllSongs,
  getSongById,
  searchSongs,
  toggleSongVisibility,
  updateSong,
  deleteSong,
} from "../controllers/songController.js";



const router = express.Router();

// Admin Create Song
router.post("/", protect, adminOnly, createSong);

// User View Songs
router.get("/", getAllSongs);

// Search Songs
router.get("/search", searchSongs);

// Song Details
router.get("/:id", getSongById);

// Admin Hide/Unhide Song
router.put(
  "/visibility/:id",
  protect,
  adminOnly,
  toggleSongVisibility
);

// Admin Update Song
router.put(
  "/:id",
  protect,
  adminOnly,
  updateSong
);

// Admin Delete Song
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteSong
);
export default router;
