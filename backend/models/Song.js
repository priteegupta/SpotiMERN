import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    songName: {
      type: String,
      required: true,
    },

    artist: {
      type: String,
      required: true,
    },

    musicDirector: {
      type: String,
      required: true,
    },

    albumName: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    genre: {
      type: String,
      default: "Bollywood",
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Song", songSchema);
