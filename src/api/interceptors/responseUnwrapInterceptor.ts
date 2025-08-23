import type {AxiosInstance, AxiosResponse} from "axios";

export function     installResponseUnwrapInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use((res: AxiosResponse) => {
        const d = res.data;
        if (d && typeof d === "object" && "data" in d) {
            (res as any).data = (d as any).data;
        }
        return res;
    }, (e) => Promise.reject(e));
}
