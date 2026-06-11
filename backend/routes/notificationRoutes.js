import express from "express";

import protect from "../middleware/authMiddleware.js";

import { getNotifications, clearNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/:id/clear", protect, clearNotification);

export default router;
