import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/User";

interface AlertState {
  type: "success" | "danger";
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: "user" | "admin" | null;
  isLoggedIn: boolean;
  loading: boolean;
  alert: AlertState | null;
  setAlert: (alert: AlertState | null) => void;
  login: (token: string, user: User) => void;
  logout: (successMsg?: string) => void;
  updateUser: (user: User) => void;
  showFeedback: (type: "success" | "danger", message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Restore session from localStorage on initial render
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedToken = localStorage.getItem("token");
        const savedUserStr = localStorage.getItem("user");

        const isTokenValid = savedToken && savedToken !== "undefined" && savedToken !== "null";
        const isUserValid = savedUserStr && savedUserStr !== "undefined" && savedUserStr !== "null";

        if (isTokenValid && isUserValid) {
          const savedUser = JSON.parse(savedUserStr);
          setToken(savedToken);
          setUser(savedUser);
          setRole(savedUser.role);
        }
      } catch (err) {
        console.error("Error restoring session from localStorage:", err);
        // Clear bad localStorage values
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setRole(newUser.role);
    showFeedback("success", `Welcome back, ${newUser.name}!`);
  };

  const logout = (successMsg?: string) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setRole(null);
    showFeedback("success", successMsg || "You have been logged out successfully.");
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setRole(updatedUser.role);
  };

  const showFeedback = (type: "success" | "danger", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isLoggedIn,
        loading,
        alert,
        setAlert,
        login,
        logout,
        updateUser,
        showFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
