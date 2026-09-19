/**
 * API Client Helper for Standalone Admin Dashboard
 * Manages communication with Sama Al-Khadraa Store Backend
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

const TOKEN_KEY = "sama_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set cookie for compatibility
  document.cookie = `admin_session_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `admin_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export async function adminApiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["x-admin-token"] = token;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "omit",
  });

  if (response.status === 401) {
    removeAdminToken();
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login?error=unauthorized";
    }
  }

  return response;
}
