import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, TOKEN_KEY } from "@/lib/api";

const AuthContext = createContext({
  admin: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/admin/me");
      setAdmin(data);
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/admin/login", { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setAdmin({ email: data.admin_email });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAdmin({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-[#666666]">Завантаження…</div>
    );
  }
  if (!admin) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return children;
}
