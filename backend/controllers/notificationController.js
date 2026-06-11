import Notification from "../models/Notification.js";

// Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      clearedBy: { $ne: req.user.id }
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Clear Notification for specific user
export const clearNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { clearedBy: req.user.id } }
    );
    res.status(200).json({
      message: "Notification cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
