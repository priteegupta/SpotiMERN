import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      clearedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: [],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Notification",
  notificationSchema
);