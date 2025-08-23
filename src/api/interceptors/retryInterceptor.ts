import type {AxiosError, AxiosInstance} from "axios";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function installRetryInterceptor(instance: AxiosInstance, maxRetries = 2) {
    instance.interceptors.response.use(undefined, async (error: AxiosError) => {
        const config: any = error.config;
        if (!config || config.__retryCount >= maxRetries) return Promise.reject(error);

        const status = error.response?.status;
        const isNetwork = !error.response;
        const isTimeout = (error.code === "ECONNABORTED") || /timeout/i.test(String(error.message));
        const is429 = status === 429;
        if (isNetwork || isTimeout || is429) {
            config.__retryCount = (config.__retryCount || 0) + 1;
            const retryAfterHeader = (error.response?.headers as any)?.["retry-after"];
            const retryAfter = retryAfterHeader ? Number(retryAfterHeader) * 1000 : 0;
            const backoff = retryAfter || Math.min(2000 * 2 ** (config.__retryCount - 1), 8000);
            await sleep(backoff);
            return instance(config);
        }
        return Promise.reject(error);
    });
}
