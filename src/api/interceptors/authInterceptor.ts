import type {AxiosInstance, InternalAxiosRequestConfig, AxiosError} from "axios";
import {TokenStorage} from "../utils/TokenStorage";
import {REFRESH_ENDPOINT} from "../config";
import {ApiError} from "../ApiError";

let isRefreshing = false;
let subscribers: Array<(t: string | null) => void> = [];
const onRefreshed = (t: string | null) => {
    subscribers.forEach(cb => cb(t));
    subscribers = [];
};
const subscribe = (cb: (t: string | null) => void) => subscribers.push(cb);

async function refreshToken(instance: AxiosInstance): Promise<string | null> {
    const rt = TokenStorage.getRefreshToken();
    if (!rt) return null;
    try {
        const res = await instance.post(REFRESH_ENDPOINT, {refreshToken: rt});
        const newAccess = (res.data as any)?.accessToken ?? "";
        const newRefresh = (res.data as any)?.refreshToken ?? rt;
        if (!newAccess) return null;
        TokenStorage.setTokens({accessToken: newAccess, refreshToken: newRefresh});
        return newAccess;
    } catch {
        TokenStorage.clear();
        return null;
    }
}

export function installAuthInterceptor(instance: AxiosInstance) {
    instance.interceptors.request.use((c: InternalAxiosRequestConfig) => {
        const at = TokenStorage.getAccessToken();
        if (at) {
            c.headers = c.headers ?? {};
            (c.headers as any).Authorization = `Bearer ${at}`;
        }
        const isForm = typeof FormData !== "undefined" && c.data instanceof FormData;
        if (!isForm) {
            (c.headers as any)["Content-Type"] = (c.headers as any)["Content-Type"] ?? "application/json";
        }
        return c;
    });
    instance.interceptors.response.use(undefined, async (error: AxiosError) => {
        const original: any = error.config;
        const status = error.response?.status;

        // 인증 실패(401)가 아닐 때는 토큰 갱신과 무관한 에러이므로, 그냥 원래 에러로 종료.
        // 무한 루프걸릴 수 있음
        if (original?.url?.includes(REFRESH_ENDPOINT) || status !== 401) return Promise.reject(error);
        if (original.__isRetryAfterRefresh) {
            TokenStorage.clear();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribe((nt) => {
                    if (!nt) return reject(error);
                    original.__isRetryAfterRefresh = true;
                    original.headers = original.headers ?? {};
                    original.headers.Authorization = `Bearer ${nt}`;
                    resolve(instance(original));
                });
            });
        }

        isRefreshing = true;
        try {
            const nt = await refreshToken(instance);
            onRefreshed(nt);
            if (!nt) throw new ApiError("Unauthorized", {status: 401, code: "UNAUTHORIZED"});
            original.__isRetryAfterRefresh = true;
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${nt}`;
            return instance(original);
        } catch (e) {
            onRefreshed(null);
            throw e;
        } finally {
            isRefreshing = false;
        }
    });
}
