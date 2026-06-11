import Song from "../models/Song.js";
import Notification from "../models/Notification.js";

// Create Song
export const createSong = async (req, res) => {
  try {

    const song = await Song.create(req.body);

    // Create notification
    const notification = await Notification.create({
      title: "New Song Added",
      message: `${song.songName} has been added to the library`,
    });

    // Broadcast newNotification event via socket
    const io = req.app.get("socketio");
    if (io) {
      io.emit("newNotification", notification);
    }

    res.status(201).json(song);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get All Visible Songs
export const getAllSongs = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { isVisible: true };
    const songs = await Song.find(filter);

    res.status(200).json(songs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Get Song By ID
export const getSongById = async (req, res) => {
  try {

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json(song);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Search Songs
export const searchSongs = async (req, res) => {
  try {

    const { artist, album, musicDirector } = req.query;

    const filter = {
      isVisible: true,
    };

    // Search by artist
    if (artist) {
      filter.artist = {
        $regex: artist,
        $options: "i",
      };
    }

    // Search by album
    if (album) {
      filter.albumName = {
        $regex: album,
        $options: "i",
      };
    }

    // Search by music director
    if (musicDirector) {
      filter.musicDirector = {
        $regex: musicDirector,
        $options: "i",
      };
    }

    const songs = await Song.find(filter);

    res.status(200).json(songs);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Song Visibility
export const toggleSongVisibility = async (req, res) => {
  try {

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    // Toggle visibility
    song.isVisible = !song.isVisible;

    // Save changes to database 
    await song.save();

    
    res.status(200).json({
      message: "Song visibility updated",
      isVisible: song.isVisible,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update Song
export const updateSong = async (req, res) => {
  try {

    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json(song);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Song
export const deleteSong = async (req, res) => {
  try {

    const song = await Song.findByIdAndDelete(
      req.params.id
    );

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json({
      message: "Song deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
