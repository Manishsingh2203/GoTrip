import React from "react";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // If no user → block access
  if (!user) {
    return null; // Home.jsx will catch login logic
  }

  return children;
};

export default RequireAuth;
