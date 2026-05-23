import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const TOKEN_KEY = "pnevmo_admin_token";

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Only redirect to admin login if currently on an admin page (not public)
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin") {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(err);
  }
);
