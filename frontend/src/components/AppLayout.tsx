import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AudioPlayer from "./AudioPlayer";
import { useAuth } from "../context/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  onSearchChange?: (val: string) => void;
  searchVal?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, onSearchChange, searchVal }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { alert, setAlert } = useAuth();

  return (
    <div className="d-flex" style={{ minHeight: "100vh", position: "relative" }}>
      {/* Sidebar - sticky on the left */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main dashboard viewport */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* Navbar */}
        <Navbar onSearchChange={onSearchChange} searchVal={searchVal} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Global Feedback Banner */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show fixed-top m-3 mx-auto`}
            style={{ maxWidth: "500px", zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
            role="alert"
          >
            {alert.type === "success" ? (
              <i className="bi bi-check-circle-fill me-2"></i>
            ) : (
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
            )}
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
          </div>
        )}
        
        {/* Scrollable page body */}
        <main className="main-content flex-grow-1">
          {children}
        </main>
      </div>

      {/* Persistent global music player bar at the bottom */}
      <AudioPlayer />
    </div>
  );
};

export default AppLayout;
