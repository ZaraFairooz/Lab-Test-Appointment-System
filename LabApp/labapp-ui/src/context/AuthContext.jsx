import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { API_BASE, jsonHeaders } from "../api/client";

const AuthContext = createContext(null);
const TOKEN_KEY = "labapp_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: jsonHeaders(null),
      body: JSON.stringify({ email, passwordHash: password }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Login failed");
    }
    const data = await res.json();
    if (!data.token) throw new Error("No token in response");
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  }, []);

  const register = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: jsonHeaders(null),
      body: JSON.stringify({
        email,
        passwordHash: password,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Registration failed");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, login, register, logout, isAuthenticated: !!token }),
    [token, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
