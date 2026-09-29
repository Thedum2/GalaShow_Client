export const API_BASE_URL = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '') ||
    (import.meta.env.MODE === 'production'
        ? 'https://api.galashow.cloud'
        : 'https://api-dev.galashow.cloud');
export const SHOULD_LOG =(typeof import.meta !== "undefined" && import.meta.env.MODE !== "production")
export const IS_DEV = import.meta.env.MODE === "development";
export const API_TIMEOUT_MS = 15000;
export const REFRESH_ENDPOINT = "/auth/refresh";
