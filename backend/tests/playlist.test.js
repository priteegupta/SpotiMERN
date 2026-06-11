import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

process.env.NODE_ENV = "test";

describe("Playlists API Integration Tests", () => {
  const testUser = {
    name: "Test Playlist User",
    email: "testplaylist@example.com",
    phone: "9876543210",
    password: "password123",
  };

  let token = "";
  let songId = "";
  let playlistId = "";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Cleanup
    await User.deleteMany({ email: testUser.email });
    await Song.deleteMany({ songName: "Test Song Title" });
    
    // Register & Login User
    await request(app).post("/api/auth/register").send(testUser);
    const authRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = authRes.body.token;

    // Create a dummy song
    const song = await Song.create({
      songName: "Test Song Title",
      artist: "Test Artist",
      musicDirector: "Test Director",
      albumName: "Test Album",
      genre: "Bollywood",
      duration: "3:45",
      releaseDate: new Date(),
      isVisible: true,
    });
    songId = song._id.toString();
  });

  afterAll(async () => {
    // Cleanup playlists
    if (playlistId) {
      await Playlist.findByIdAndDelete(playlistId);
    }
    await User.deleteMany({ email: testUser.email });
    await Song.deleteMany({ songName: "Test Song Title" });
  });

  it("should successfully create a new playlist", async () => {
    const res = await request(app)
      .post("/api/playlists")
      .set("Authorization", `Bearer ${token}`)
      .send({
        playlistName: "My Chill List",
        description: "Some description here",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("playlistName", "My Chill List");
    expect(res.body).toHaveProperty("_id");
    playlistId = res.body._id;
  });

  it("should successfully fetch my playlists list", async () => {
    const res = await request(app)
      .get("/api/playlists")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("playlistName", "My Chill List");
  });

  it("should successfully add a song to the playlist", async () => {
    const res = await request(app)
      .post(`/api/playlists/${playlistId}/songs`)
      .set("Authorization", `Bearer ${token}`)
      .send({ songId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Song added successfully");
    expect(res.body.playlist.songs).toContain(songId);
  });

  it("should fail to add a duplicate song to the playlist", async () => {
    const res = await request(app)
      .post(`/api/playlists/${playlistId}/songs`)
      .set("Authorization", `Bearer ${token}`)
      .send({ songId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Song already exists in playlist");
  });

  it("should successfully remove a song from the playlist", async () => {
    const res = await request(app)
      .delete(`/api/playlists/${playlistId}/songs/${songId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Song removed successfully");
    expect(res.body.playlist.songs).not.toContain(songId);
  });
});
