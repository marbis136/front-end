// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // ej: "http://localhost:8000/api"
});
  
// 🔐 Interceptor: añade el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Interceptor: renueva el token si expira (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          // 🔁 Pide nuevo access token
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE}/token/refresh/`, // ✅ ajustado a tus rutas
            { refresh }
          );

          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);

          // Reintenta la petición original
          error.config.headers.Authorization = `Bearer ${newAccess}`;
          return api(error.config);
        } catch (refreshError) {
          console.error("❌ No se pudo refrescar el token:", refreshError);

          // Limpieza y redirección
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("username");
          window.location.href = "/login"; // ajusta a tu ruta de login en React
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
