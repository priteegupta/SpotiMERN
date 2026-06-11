import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import NotificationCard from "../components/NotificationCard";
import { getNotifications, clearNotification } from "../services/notificationService";
import type { Notification } from "../types/Notification";
import { io } from "socket.io-client";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();

    // Connect to backend WebSocket server
    const socket = io("http://localhost:5000");

    socket.on("newNotification", (newNotif: Notification) => {
      // Prepend the new notification to the array in real-time
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error retrieving notifications:", err);
      setError("Failed to retrieve system alerts.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearNotification = async (id: string) => {
    try {
      await clearNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Error clearing notification:", err);
      setError("Failed to clear notification.");
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 text-white mb-1">Notifications</h1>
            <p className="text-light-gray">View real-time updates and logs about the music library.</p>
          </div>
          <button 
            onClick={fetchData} 
            className="btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px" }}
            title="Refresh Feed"
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {notifications.length === 0 ? (
              <div className="spotify-card py-5 text-center my-4">
                <span style={{ fontSize: "3rem" }}>🔔</span>
                <h5 className="text-white mt-2">No alerts yet</h5>
                <p className="text-muted mb-0">Whenever new songs are added or edits occur, updates will appear here.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-1">
                {notifications.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    notification={notif}
                    onClear={handleClearNotification}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
