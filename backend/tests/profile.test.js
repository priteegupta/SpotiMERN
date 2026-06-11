import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";

process.env.NODE_ENV = "test";

describe("User Profile API Integration Tests", () => {
  const testUser = {
    name: "Test Profile User",
    email: "testprofile@example.com",
    phone: "9876543210",
    password: "password123",
  };

  const otherUser = {
    name: "Other User",
    email: "otheruser@example.com",
    phone: "9876543211",
    password: "password123",
  };

  let token = "";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Clean database
    await User.deleteMany({ email: { $in: [testUser.email, otherUser.email, "updatedprofile@example.com"] } });

    // Register users
    await request(app).post("/api/auth/register").send(testUser);
    await request(app).post("/api/auth/register").send(otherUser);

    // Login main test user
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: [testUser.email, otherUser.email, "updatedprofile@example.com"] } });
  });

  it("should successfully fetch profile details for authenticated user", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", testUser.email);
    expect(res.body).toHaveProperty("phone", testUser.phone);
    expect(res.body).not.toHaveProperty("password");
  });

  it("should fail to fetch profile details without auth token", async () => {
    const res = await request(app).get("/api/user/profile");
    expect(res.statusCode).toBe(401);
  });

  it("should successfully update profile details", async () => {
    const res = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Profile Name",
        email: "updatedprofile@example.com",
        phone: "9999999999",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Profile updated successfully");
    expect(res.body.user).toHaveProperty("name", "Updated Profile Name");
    expect(res.body.user).toHaveProperty("email", "updatedprofile@example.com");
    expect(res.body.user).toHaveProperty("phone", "9999999999");
  });

  it("should fail to update profile with duplicate email owned by another user", async () => {
    const res = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Profile Name",
        email: otherUser.email,
        phone: "9999999999",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Email is already in use by another account");
  });

  it("should fail to update profile with invalid name / formats", async () => {
    const res = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Name123", // invalid
        email: "not-an-email", // invalid
        phone: "123", // invalid
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
