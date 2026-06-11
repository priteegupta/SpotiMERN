import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

process.env.NODE_ENV = "test";

describe("Notifications API Integration Tests", () => {
  const testUser = {
    name: "Test Notification User",
    email: "testnotification@example.com",
    phone: "9876543210",
    password: "password123",
  };

  let token = "";
  let userObjectId = "";
  let notifAId = "";
  let notifBId = "";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Clean database
    await User.deleteMany({ email: testUser.email });
    await Notification.deleteMany({ title: { $in: ["Test Notif A", "Test Notif B"] } });

    // Register & Login User
    await request(app).post("/api/auth/register").send(testUser);
    const authRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = authRes.body.token;
    userObjectId = authRes.body.user.id;

    // Create notifications
    const notifA = await Notification.create({
      title: "Test Notif A",
      message: "Message A",
    });
    notifAId = notifA._id.toString();

    const notifB = await Notification.create({
      title: "Test Notif B",
      message: "Message B",
    });
    notifBId = notifB._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await Notification.deleteMany({ title: { $in: ["Test Notif A", "Test Notif B"] } });
  });

  it("should fetch all active system notifications that have not been cleared by the user", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    // There might be other notifications in DB, but these two must be present
    const titles = res.body.map(n => n.title);
    expect(titles).toContain("Test Notif A");
    expect(titles).toContain("Test Notif B");
  });

  it("should successfully clear a notification locally for the logged-in user", async () => {
    const res = await request(app)
      .post(`/api/notifications/${notifAId}/clear`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Notification cleared successfully");

    // Fetch notifications again and verify Notif A is excluded
    const getRes = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    const titles = getRes.body.map(n => n.title);
    expect(titles).not.toContain("Test Notif A");
    expect(titles).toContain("Test Notif B");
  });
});
