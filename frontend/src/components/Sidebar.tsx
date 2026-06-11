import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user && user.role === "admin";

  const handleLogout = () => {
    logout("You have successfully logged out.");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className={`spotify-sidebar ${isOpen ? "open" : ""}`}>
      <div className="px-3 mb-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <span style={{ fontSize: "1.8rem" }}>🎵</span>
          <span className="h4 m-0 fw-bold" style={{ letterSpacing: "-0.5px", fontFamily: "var(--font-heading)" }}>
            SpotiMERN
          </span>
        </div>
        <button 
          className="btn btn-close btn-close-white d-md-none p-1 border-0" 
          onClick={onClose} 
          aria-label="Close sidebar"
          style={{ boxShadow: "none" }}
        ></button>
      </div>

      <nav className="d-flex flex-column gap-1 flex-grow-1">
        <Link to="/dashboard" onClick={onClose} className={`sidebar-link ${isActive("/dashboard")}`}>
          <i className="bi bi-house-door-fill"></i>
          <span>Dashboard</span>
        </Link>

        <Link to="/songs" onClick={onClose} className={`sidebar-link ${isActive("/songs")}`}>
          <i className="bi bi-music-note-beamed"></i>
          <span>Songs</span>
        </Link>

        <Link to="/playlists" onClick={onClose} className={`sidebar-link ${isActive("/playlists")}`}>
          <i className="bi bi-music-note-list"></i>
          <span>Playlists</span>
        </Link>

        <Link to="/notifications" onClick={onClose} className={`sidebar-link ${isActive("/notifications")}`}>
          <i className="bi bi-bell-fill"></i>
          <span>Notifications</span>
        </Link>

        <Link to="/profile" onClick={onClose} className={`sidebar-link ${isActive("/profile")}`}>
          <i className="bi bi-person-fill"></i>
          <span>Profile</span>
        </Link>

        {isAdmin && (
          <>
            <hr style={{ borderColor: "#2f2f2f" }} />
            <div className="px-3 py-2 text-muted uppercase font-heading fw-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              ADMIN PORTAL
            </div>
            <Link to="/admin/dashboard" onClick={onClose} className={`sidebar-link ${isActive("/admin/dashboard")}`}>
              <i className="bi bi-speedometer2"></i>
              <span>Admin Stats</span>
            </Link>
            <Link to="/admin/songs" onClick={onClose} className={`sidebar-link ${isActive("/admin/songs")}`}>
              <i className="bi bi-gear-fill"></i>
              <span>Manage Songs</span>
            </Link>
            <Link to="/admin/users" onClick={onClose} className={`sidebar-link ${isActive("/admin/users")}`}>
              <i className="bi bi-people-fill"></i>
              <span>Manage Users</span>
            </Link>
          </>
        )}
      </nav>

      <button onClick={handleLogout} className="sidebar-link border-0 w-100 bg-transparent text-start mt-auto" style={{ cursor: "pointer" }}>
        <i className="bi bi-box-arrow-left text-danger"></i>
        <span className="text-danger">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
