import axios from "axios";
import {API_BASE_URL, API_TIMEOUT_MS} from "./config";
import {installAuthInterceptor} from "./interceptors/authInterceptor";
import {installLoggingInterceptor} from "./interceptors/loggingInterceptor";
import {installRetryInterceptor} from "./interceptors/retryInterceptor";
import {installResponseUnwrapInterceptor} from "./interceptors/responseUnwrapInterceptor";

const axiosInstance = axios.create({baseURL: API_BASE_URL, timeout: API_TIMEOUT_MS});
axiosInstance.interceptors.request.use((c) => {
    (c.headers as any)["Accept"] = "application/json";
    return c;
});

console.log("[axios] created baseURL is"+API_BASE_URL);

installResponseUnwrapInterceptor(axiosInstance);
installAuthInterceptor(axiosInstance);
installRetryInterceptor(axiosInstance);
installLoggingInterceptor(axiosInstance);

export {axiosInstance};
