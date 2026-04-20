export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5066";

export function jsonHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}
