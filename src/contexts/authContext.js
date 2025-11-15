import { createContext, useContext, useEffect, useState } from "react";

import { signout } from "@/services/authService";

const AuthContext = createContext({
  isAuthenticated: false,
  loading: true,
  user: null,
  setUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setUser({ token });
      }
    }
    setLoading(false);
  }, []);


  async function logout() {
    try {
      await signout();
    } catch (e) {
      // Ignora erro de logout (ex: token já expirado)
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
