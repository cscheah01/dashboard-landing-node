const LOCAL_API_URL = "http://localhost:5000";

export function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (configuredUrl) {
    return configuredUrl;
  }

  return process.env.NODE_ENV === "development" ? LOCAL_API_URL : "";
}

export function getApiUrl(path: string) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return "";
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export function apiFetch(path: string, options?: RequestInit) {
  const url = getApiUrl(path);

  if (!url) {
    return Promise.reject(new Error("API URL is not configured"));
  }

  return fetch(url, options);
}
