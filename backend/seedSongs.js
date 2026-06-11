import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Song from "./models/Song.js";
import songs from "./data/songs.js";

dotenv.config();

const seedSongs = async () => {
  try {
    // Connect Database
    await connectDB();

    console.log("MongoDB Connected");

    // Delete old songs
    await Song.deleteMany();

    console.log("Old songs deleted");

    // Insert new songs
    await Song.insertMany(songs);

    console.log("18 songs inserted successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedSongs();
