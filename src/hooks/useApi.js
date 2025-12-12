import { useAuth } from "../auth/AuthContext";

export function useApi() {
  const { user, setUser, logout } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE;

  async function fetchWithAuth(url, options = {}) {
    let access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    // 🔹 Si token expiró => refrescar
    if (response.status === 401 && refresh) {
      const refreshRes = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("access", data.access);
        access = data.access;
        setUser((prev) => ({ ...prev, access }));

        // Reintentar la request original
        response = await fetch(`${API_URL}${url}`, {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${access}` },
        });
      } else {
        logout();
        throw new Error("Sesión expirada");
      }
    }

    return response;
  }

  return { fetchWithAuth };
}
