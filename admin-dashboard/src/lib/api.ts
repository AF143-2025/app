/**
 * API Client Helper for Standalone Admin Dashboard
 * Manages communication with Sama Al-Khadraa Store Backend
 */

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sama_api_url");
    if (stored && stored.trim()) {
      return stored.trim().replace(/\/$/, "");
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, "");
  }
  // Default to live deployed backend store
  return "https://app55.vercel.app";
}

export function setCustomApiUrl(url: string) {
  if (typeof window !== "undefined") {
    if (!url || !url.trim()) {
      localStorage.removeItem("sama_api_url");
    } else {
      let clean = url.trim().replace(/\/$/, "");
      if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
        clean = `https://${clean}`;
      }
      localStorage.setItem("sama_api_url", clean);
    }
  }
}

export const API_BASE_URL = "https://app55.vercel.app";

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
  const baseUrl = getApiBaseUrl();

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

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
