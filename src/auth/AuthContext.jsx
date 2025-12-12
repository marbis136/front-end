// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🧩 Recuperar datos del usuario logueado
  async function fetchUser() {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const res = await api.get("/usuario/me/");
      setUser(res.data);
    } catch (error) {
      console.error("❌ Error al obtener usuario:", error);
      logout();
    }
  }

  // 🔐 Login con tus credenciales
  async function login({ username, password }) {
    try {
      const res = await api.post("/token/web/", { username, password }); // ✅ ajustado a tu ruta

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", username);

      await fetchUser(); // carga el usuario logueado
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw error;
    }
  }
  
  // 🔓 Logout
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
  }

  // ♻️ Restaurar sesión al recargar
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
