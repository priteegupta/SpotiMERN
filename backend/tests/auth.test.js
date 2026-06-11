import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";

// Set environment variable for test
process.env.NODE_ENV = "test";

describe("Authentication API Integration Tests", () => {
  const testUser = {
    name: "Test User Auth",
    email: "testuserauth@example.com",
    phone: "1234567890",
    password: "password123",
  };

  beforeAll(async () => {
    // If server.js didn't connect yet, connect here
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    // Clean up database of test users
    await User.deleteMany({ email: testUser.email });
  });

  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
  });

  it("should successfully register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should fail to register user with existing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should successfully login a registered user and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", testUser.email);
  });

  it("should fail to login with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
