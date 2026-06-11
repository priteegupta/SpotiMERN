import express from "express";

import protect from "../middleware/authMiddleware.js";
import {
  createPlaylist,
  getMyPlaylists,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  searchSongInPlaylist,
  toggleRepeat,
  toggleShuffle,
} from "../controllers/playlistController.js";


const router = express.Router();

// Create Playlist
router.post("/", protect, createPlaylist);

// Get Logged-in User Playlists
router.get(
  "/",
  protect,
  getMyPlaylists
);

// Update Playlist
router.put(
  "/:id",
  protect,
  updatePlaylist
);

// Delete Playlist
router.delete(
  "/:id",
  protect,
  deletePlaylist
);

// Add Song To Playlist
router.post(
  "/:id/songs",
  protect,
  addSongToPlaylist
);

// Delete the song from playlist
router.delete(
  "/:playlistId/songs/:songId",
  protect,
  removeSongFromPlaylist
);

// Search for a song in the playlist
router.get("/:id/search", protect, searchSongInPlaylist);

// Toggle Repeat Mode
router.put("/:id/repeat", protect, toggleRepeat);

// Toggle Shuffle Mode
router.put("/:id/shuffle", protect, toggleShuffle);

export default router;

