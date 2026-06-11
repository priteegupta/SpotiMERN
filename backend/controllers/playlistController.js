import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

// Create Playlist
export const createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      playlistName: req.body.playlistName,

      description: req.body.description,

      userId: req.user.id,
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Playlists
export const getMyPlaylists = async (
  req,
  res
) => {
  try {

   const playlists = await Playlist.find({
     userId: req.user.id,
   }).populate("songs");

    res.status(200).json(playlists);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Update Playlist
export const updatePlaylist = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.id,
        },
        req.body,
        {
          new: true,
        }
      );

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    res.status(200).json(playlist);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Delete Playlist
export const deletePlaylist = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      message:
        "Playlist deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Add Song To Playlist
export const addSongToPlaylist = async (
  req,
  res
) => {
  try {

    const { songId } = req.body;

    const playlist =
      await Playlist.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const song =
      await Song.findById(songId);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    // Prevent duplicate songs
    if (
      playlist.songs.some(id => id.toString() === songId)
    ) {
      return res.status(400).json({
        message:
          "Song already exists in playlist",
      });
    }

    playlist.songs.push(songId);

    await playlist.save();

    res.status(200).json({
      message:
        "Song added successfully",
      playlist,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Remove Song From Playlist
export const removeSongFromPlaylist = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOne({
        _id: req.params.playlistId,
        userId: req.user.id,
      });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    playlist.songs =
      playlist.songs.filter(
        song =>
          song.toString() !==
          req.params.songId
      );

    await playlist.save();

    res.status(200).json({
      message:
        "Song removed successfully",
      playlist,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Search Song In Playlist
export const searchSongInPlaylist = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOne({
        _id: req.params.id,
        userId: req.user.id,
      }).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const keyword =
      req.query.keyword || "";

    const filteredSongs =
      playlist.songs.filter(song =>
        song.songName
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )
      );

    res.status(200).json(
      filteredSongs
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Toggle Repeat
export const toggleRepeat = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    playlist.repeat =
      !playlist.repeat;

    await playlist.save();

    res.status(200).json({
      message:
        "Repeat updated",
      repeat:
        playlist.repeat,
    });

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};

// Toggle Shuffle
export const toggleShuffle = async (
  req,
  res
) => {
  try {

    const playlist =
      await Playlist.findOne({
        _id:req.params.id,
        userId:req.user.id,
      });

    if (!playlist) {
      return res.status(404).json({
        message:"Playlist not found",
      });
    }

    playlist.shuffle =
      !playlist.shuffle;

    await playlist.save();

    res.status(200).json({
      message:
        "Shuffle updated",
      shuffle:
        playlist.shuffle,
    });

  } catch (error) {

    res.status(500).json({
      message:error.message,
    });

  }
};