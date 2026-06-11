import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SongsPage from "./pages/SongsPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailsPage from "./pages/PlaylistDetailsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageSongsPage from "./pages/ManageSongsPage";
import ManageUsersPage from "./pages/ManageUsersPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { AudioProvider } from "./context/AudioContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />

            {/* Protected User routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/songs"
              element={
                <ProtectedRoute>
                  <SongsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <PlaylistsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists/:id"
              element={
                <ProtectedRoute>
                  <PlaylistDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin-Only routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/songs"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <ManageSongsPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <ManageUsersPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
