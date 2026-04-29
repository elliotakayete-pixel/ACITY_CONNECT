import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api.js";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("acity_user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("acity_token"));
  const [user, setUser] = useState(storedUser);

  const saveSession = (data) => {
    localStorage.setItem("acity_token", data.token);
    localStorage.setItem("acity_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
      token: ""
    });
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: payload,
      token: ""
    });
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("acity_token");
    localStorage.removeItem("acity_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    const nextUser = { ...user, ...updates };
    localStorage.setItem("acity_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      updateUser
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
