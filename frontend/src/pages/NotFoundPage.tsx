import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--spotify-black)",
        color: "var(--text-white)",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <span style={{ fontSize: "5rem" }}>🎧❓</span>
      <h1 className="display-4 fw-extrabold mt-3 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
        Page Not Found
      </h1>
      <p className="text-light-gray mb-4" style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
        We can't seem to find the tune you are looking for. It might have been deleted, moved, or never existed in the first place.
      </p>
      <Link to="/dashboard" className="btn btn-spotify py-2.5 px-4 font-heading">
        BACK TO DASHBOARD
      </Link>
    </div>
  );
};

export default NotFoundPage;
