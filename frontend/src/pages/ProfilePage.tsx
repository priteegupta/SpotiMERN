import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import { getUserProfile, updateUserProfile } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const ProfilePage: React.FC = () => {
  const { updateUser } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone || "");
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      showFeedback("danger", "Failed to retrieve profile details.");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "danger", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name Validation
    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces.";
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone Validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number must contain only numbers.";
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateUserProfile({ name, email, phone });
      showFeedback("success", result.message || "Profile updated successfully!");
      
      // Update global context so header reflects updated details
      updateUser(result.user);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      showFeedback(
        "danger",
        err.response?.data?.message || "Failed to update profile. Email might be in use."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0" style={{ maxWidth: "600px" }}>
        <div className="mb-4 text-start">
          <h1 className="h2 text-white mb-1">Account Profile</h1>
          <p className="text-light-gray">View and update your personal details below.</p>
        </div>

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

        {loading ? (
          <Loader />
        ) : (
          <div className="card border border-secondary p-4 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)", borderRadius: "8px" }}>
            <form onSubmit={handleSubmit}>
              {/* Full Name field */}
              <div className="mb-3">
                <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control spotify-input ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Email Address field */}
              <div className="mb-3">
                <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Email / Gmail Address
                </label>
                <input
                  type="email"
                  className={`form-control spotify-input ${errors.email ? "is-invalid" : ""}`}
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Phone Number field */}
              <div className="mb-4">
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

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 pt-2 border-top border-secondary">
                <button
                  type="button"
                  onClick={loadProfile}
                  className="btn btn-spotify-outline btn-sm px-4"
                  disabled={submitting}
                >
                  RESET
                </button>
                <button
                  type="submit"
                  className="btn btn-spotify btn-sm px-4"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      SAVING...
                    </>
                  ) : (
                    "SAVE CHANGES"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
