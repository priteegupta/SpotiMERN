import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt: string;
}

const ManageUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get<UserItem[]>("/user");
      setUsers(res.data);
    } catch (err: any) {
      console.error("Error loading users:", err);
      showFeedback("danger", err.response?.data?.message || "Failed to load registered users.");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "danger", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (currentUser?.id === id) {
      showFeedback("danger", "You cannot delete your own logged-in admin account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      return;
    }

    try {
      await API.delete(`/user/${id}`);
      showFeedback("success", `User "${name}" has been deleted.`);
      loadUsers();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      showFeedback("danger", err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0">
        <div className="mb-4 text-start">
          <h1 className="h2 text-white mb-1">Manage Users</h1>
          <p className="text-light-gray">View, moderate, and remove user accounts across the system.</p>
        </div>

        {/* Action alerts */}
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
          <div className="card border border-secondary p-3 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)" }}>
            {users.length === 0 ? (
              <div className="text-center py-5">
                <span style={{ fontSize: "2.5rem" }}>👥</span>
                <p className="text-muted mt-2">No registered users found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle border-0 mb-0" style={{ backgroundColor: "transparent" }}>
                  <thead>
                    <tr className="text-muted border-secondary" style={{ fontSize: "0.8rem" }}>
                      <th scope="col" style={{ width: "25%" }}>NAME</th>
                      <th scope="col" style={{ width: "25%" }}>EMAIL</th>
                      <th scope="col" style={{ width: "15%" }}>PHONE</th>
                      <th scope="col" style={{ width: "10%" }} className="text-center">ROLE</th>
                      <th scope="col" style={{ width: "15%" }} className="text-center">JOINED</th>
                      <th scope="col" style={{ width: "10%" }} className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-secondary" style={{ fontSize: "0.85rem" }}>
                        {/* Name */}
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="d-flex justify-content-center align-items-center rounded-circle text-black fw-bold"
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: u.role === "admin" ? "#1ed760" : "#ffffff",
                                fontSize: "0.75rem",
                              }}
                            >
                              {u.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-white fw-semibold">{u.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="text-light-gray">{u.email}</td>

                        {/* Phone */}
                        <td className="text-light-gray">{u.phone}</td>

                        {/* Role */}
                        <td className="text-center">
                          <span
                            className={`badge ${u.role === "admin" ? "bg-success" : "bg-secondary"}`}
                            style={{ fontSize: "0.7rem", padding: "0.3em 0.6em" }}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="text-center text-muted">
                          {new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                          <button
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete User"
                            disabled={currentUser?.id === u._id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageUsersPage;
