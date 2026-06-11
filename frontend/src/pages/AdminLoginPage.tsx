import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, role, showFeedback } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (isLoggedIn) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isLoggedIn, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      
      // Verify role
      if (response.user.role !== "admin") {
        setError("Access denied. This portal is restricted to administrator accounts.");
        return;
      }

      // Store in global context
      login(response.token, response.user);
      
      showFeedback("success", `Welcome back Admin: ${response.user.name}`);
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Failed to log in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center w-100 flex-grow-1" 
      style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(to bottom, #111 0%, #000 100%)",
        padding: "20px"
      }}
    >
      <div 
        className="card p-4 shadow-lg border border-secondary text-start" 
        style={{ 
          width: "100%", 
          maxWidth: "450px", 
          backgroundColor: "var(--spotify-dark-gray)",
          borderRadius: "12px"
        }}
      >
        <div className="text-center mb-4">
          <span style={{ fontSize: "3rem" }}>🛡️</span>
          <h1 className="h2 mt-2 fw-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Admin Control
          </h1>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Sign in to manage music catalog & users
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem" }} role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Admin Email
            </label>
            <input
              type="email"
              className="form-control spotify-input"
              placeholder="admin@spotimern.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              className="form-control spotify-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-spotify w-100 py-2.5 mb-3"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            ADMIN LOGIN
          </button>
        </form>

        <div className="text-center mt-3 border-top border-secondary pt-3">
          <span className="text-light-gray" style={{ fontSize: "0.85rem" }}>
            Not an admin?{" "}
          </span>
          <Link 
            to="/login" 
            className="text-success fw-bold text-decoration-none hover-white"
            style={{ fontSize: "0.85rem" }}
          >
            User Login
          </Link>
          <br />
          <Link 
            to="/" 
            className="text-muted text-decoration-none hover-white d-inline-block mt-2"
            style={{ fontSize: "0.8rem" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
