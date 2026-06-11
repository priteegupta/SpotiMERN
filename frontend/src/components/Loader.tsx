import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center py-5 my-5 w-100 flex-column">
      <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted" style={{ letterSpacing: "1px", fontSize: "0.9rem" }}>
        LOADING HARMONIES...
      </p>
    </div>
  );
};

export default Loader;
