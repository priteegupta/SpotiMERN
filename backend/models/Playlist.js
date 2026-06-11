import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    playlistName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Playlist Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Songs inside playlist
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],

    // Future player settings
    repeat: {
      type: Boolean,
      default: false,
    },

    shuffle: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
