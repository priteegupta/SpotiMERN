import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getNotifications } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

interface NavbarProps {
  onSearchChange?: (val: string) => void;
  searchVal?: string;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange, searchVal, onToggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [notifCount, setNotifCount] = useState<number>(0);

  const userName = user ? user.name : "Guest";
  const userRole = user ? user.role : "user";

  // Fetch notifications to show count badge
  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const notifs = await getNotifications();
        setNotifCount(notifs.length);
      } catch (err) {
        console.error("Error fetching notification count for navbar:", err);
      }
    };

    fetchNotificationsCount();

    // Connect to backend WebSocket server
    const socket = io("http://localhost:5000");

    socket.on("newNotification", () => {
      // Re-fetch notifications count immediately
      fetchNotificationsCount();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const isSongsPage = location.pathname === "/songs" || location.pathname === "/admin/songs";

  return (
    <header className="spotify-navbar">
      {/* Toggle button and Search Bar section */}
      <div className="d-flex align-items-center flex-grow-1" style={{ maxWidth: "400px" }}>
        {onToggleSidebar && (
          <button
            className="btn btn-outline-secondary border-secondary text-white d-md-none me-2 p-1 px-2"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            style={{ fontSize: "1.1rem" }}
          >
            <i className="bi bi-list"></i>
          </button>
        )}
        {isSongsPage && onSearchChange !== undefined ? (
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary text-light-gray" style={{ borderRight: "none" }}>
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control spotify-input py-2"
              placeholder="Search by artist, album, genre, or song..."
              value={searchVal || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ borderLeft: "none", fontSize: "0.85rem" }}
            />
          </div>
        ) : (
          <div className="text-muted text-start" style={{ fontSize: "0.9rem" }}>
            Welcome back to the rhythm
          </div>
        )}
      </div>

      {/* Right User Profiling section */}
      <div className="d-flex align-items-center gap-4">
        {/* Notification Bell */}
        <Link to="/notifications" className="position-relative text-light-gray hover-white" style={{ textDecoration: "none" }}>
          <i className="bi bi-bell-fill" style={{ fontSize: "1.3rem" }}></i>
          {notifCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.6rem", padding: "0.25em 0.45em" }}
            >
              {notifCount}
            </span>
          )}
        </Link>

        {/* User Badge */}
        <Link to="/profile" className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: "inherit" }}>
          <div className="d-flex flex-column text-end">
            <span className="fw-bold text-white leading-none" style={{ fontSize: "0.9rem" }}>
              {userName}
            </span>
            <span
              className={`badge rounded-pill align-self-end mt-1 ${userRole === "admin" ? "bg-success" : "bg-secondary"}`}
              style={{ fontSize: "0.65rem", padding: "0.25em 0.6em", width: "fit-content" }}
            >
              {userRole.toUpperCase()}
            </span>
          </div>

          <div
            className="d-flex justify-content-center align-items-center rounded-circle text-black fw-bold hover-scale"
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "var(--spotify-green)",
              fontSize: "0.85rem",
              fontFamily: "var(--font-heading)",
              transition: "transform 0.2s ease"
            }}
          >
            {getInitials(userName)}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
