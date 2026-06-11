import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

interface Props {
  children: React.ReactElement;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "admin") {
    // Unauthorized redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
