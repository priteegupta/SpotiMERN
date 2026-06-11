import React from "react";
import type { Notification } from "../types/Notification";

interface NotificationCardProps {
  notification: Notification;
  onClear?: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClear }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return dateStr;
    }
  };

  return (
    <div className="card mb-3 alert-dark-spotify border border-secondary shadow-sm">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title text-success mb-0" style={{ fontSize: "1rem" }}>
            <i className="bi bi-info-circle-fill me-2"></i>
            {notification.title}
          </h5>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              {formatDate(notification.createdAt)}
            </small>
            {onClear && (
              <button
                onClick={() => onClear(notification._id)}
                className="btn btn-close btn-close-white p-1 ms-2"
                style={{ fontSize: "0.65rem", boxShadow: "none" }}
                aria-label="Dismiss alert"
              ></button>
            )}
          </div>
        </div>
        <p className="card-text text-light-gray" style={{ fontSize: "0.9rem" }}>
          {notification.message}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
