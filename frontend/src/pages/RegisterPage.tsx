import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name Validation (Only letters and spaces allowed)
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters (numbers or special characters are not allowed)";
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Validation (Only digits allowed, exactly 10 digits)
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number can only contain digits (letters are not allowed)";
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Password Validation (Min 6 characters)
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({
        name,
        email,
        phone,
        password,
      });

      setSuccessMsg(result.message || "Registration successful! Redirecting to login...");
      
      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");

      // Redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setApiError(
        err.response?.data?.message ||
        "Registration failed. Please check details and try again."
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
        background: "linear-gradient(to bottom, #2c2d30 0%, #000000 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card p-4 shadow-lg border border-secondary text-start"
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "var(--spotify-dark-gray)",
          borderRadius: "12px",
        }}
      >
        <div className="text-center mb-4">
          <span style={{ fontSize: "3rem" }}>🎵</span>
          <h1 className="h2 mt-2 fw-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Create Account
          </h1>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Join SpotiMERN to organize your tracks
          </p>
        </div>

        {apiError && (
          <div className="alert alert-danger py-2" style={{ fontSize: "0.85rem" }} role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {apiError}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success py-2" style={{ fontSize: "0.85rem" }} role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-3">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Full Name
            </label>
            <input
              type="text"
              className={`form-control spotify-input ${errors.name ? "is-invalid" : ""}`}
              placeholder="Arijit Singh"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email input */}
          <div className="mb-3">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Email address
            </label>
            <input
              type="email"
              className={`form-control spotify-input ${errors.email ? "is-invalid" : ""}`}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Phone input */}
          <div className="mb-3">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Phone Number (10 digits)
            </label>
            <input
              type="text"
              className={`form-control spotify-input ${errors.phone ? "is-invalid" : ""}`}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          {/* Password input */}
          <div className="mb-3">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Password (minimum 6 characters)
            </label>
            <input
              type="password"
              className={`form-control spotify-input ${errors.password ? "is-invalid" : ""}`}
              placeholder="Choose a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Confirm Password input */}
          <div className="mb-4">
            <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Confirm Password
            </label>
            <input
              type="password"
              className={`form-control spotify-input ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-spotify w-100 py-2.5 mb-3" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            CREATE ACCOUNT
          </button>
        </form>

        <div className="text-center mt-3 border-top border-secondary pt-3">
          <span className="text-light-gray" style={{ fontSize: "0.85rem" }}>
            Already have an account?{" "}
          </span>
          <Link to="/login" className="text-success fw-bold text-decoration-none hover-white" style={{ fontSize: "0.85rem" }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
