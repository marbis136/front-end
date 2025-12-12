//const API_URL1 = "http://127.0.0.1:8000/api/auth";
const API_URL = `${import.meta.env.VITE_API_BASE}/auth`;

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function saveTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const response = await fetch(`${API_URL}/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error("Error al refrescar token");

  const data = await response.json();
  saveTokens(data);
  return data.access;
}
