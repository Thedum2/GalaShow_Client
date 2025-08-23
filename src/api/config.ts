export const API_BASE_URL =import.meta.env.VITE_API_URL
export const SHOULD_LOG =(typeof import.meta !== "undefined" && import.meta.env.MODE !== "production")
export const API_TIMEOUT_MS = 15000;
export const REFRESH_ENDPOINT = "/auth/refresh";
