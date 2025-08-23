import type {AxiosRequestConfig} from "axios";
import {axiosInstance} from "./axiosInstance";
import {ApiError} from "./ApiError";

type Mapper<T> = (json: any) => T;

function wrapError(e: any): never {
    const status = e?.response?.status;
    const msg = e?.response?.data?.message || e?.message || "Request failed";
    throw new ApiError(msg, {status, details: e?.response?.data});
}

export const httpClient = {
    async get<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.get(url, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async getList<T>(url: string, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T[]> {
        try {
            const res = await axiosInstance.get(url, config);
            const arr = Array.isArray(res.data) ? res.data : res.data?.items ?? [];
            return arr.map(mapper);
        } catch (e) {
            wrapError(e);
        }
    },
    async post<T>(url: string, body: any, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.post(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async put<T>(url: string, body: any, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.put(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async patch<T>(url: string, body: any, mapper: Mapper<T>, config?: AxiosRequestConfig): Promise<T> {
        try {
            const res = await axiosInstance.patch(url, body, config);
            return mapper(res.data);
        } catch (e) {
            wrapError(e);
        }
    },
    async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
        try {
            await axiosInstance.delete(url, config);
        } catch (e) {
            wrapError(e);
        }
    },
};
