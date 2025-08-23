import type {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse} from "axios";
import {SHOULD_LOG} from "../config";

export function installLoggingInterceptor(instance: AxiosInstance) {
    if (!SHOULD_LOG) return;
    instance.interceptors.request.use((c: InternalAxiosRequestConfig) => {
        console.debug(`[HTTP] → ${c.method?.toUpperCase()} ${c.baseURL}${c.url}`, {
            headers: c.headers,
            params: c.params,
            data: c.data
        });
        return c;
    });
    instance.interceptors.response.use((r: AxiosResponse) => {
        console.debug(`[HTTP] ← ${r.status} ${r.config.method?.toUpperCase()} ${r.config.url}`, r.data);
        return r;
    }, (err) => {
        const {config, response} = err || {};
        console.debug(`[HTTP] ⨯ ${response?.status ?? "ERR"} ${config?.method?.toUpperCase()} ${config?.url}`, response?.data ?? err?.message);
        return Promise.reject(err);
    });
}
