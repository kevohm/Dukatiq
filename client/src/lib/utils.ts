
import { apiClient } from './api-client'

export type ApiResponse<T> = {
    success: boolean
    data: T
    message: string
}

// -----------------------------
// helper
// -----------------------------
const unwrap = <T>(res: ApiResponse<T>): T => res.data

// -----------------------------
// API WRAPPER
// -----------------------------
export const api = {
    // RAW (full response)
    getRaw: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
        const res = await apiClient.get(url, { params })
        return res.data
    },

    postRaw: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
        const res = await apiClient.post(url, data)
        return res.data
    },

    patchRaw: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
        const res = await apiClient.patch(url, data)
        return res.data
    },

    putRaw: async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
        const res = await apiClient.put(url, data)
        return res.data
    },

    deleteRaw: async <T>(url: string): Promise<ApiResponse<T>> => {
        const res = await apiClient.delete(url)
        return res.data
    },

    // -----------------------------
    // CLEAN UI MODE (recommended)
    // -----------------------------
    get: async <T>(url: string, params?: any): Promise<T> => {
        const res = await apiClient.get<ApiResponse<T>>(url, { params })
        return unwrap(res.data)
    },

    post: async <T>(url: string, data?: any): Promise<T> => {
        const res = await apiClient.post<ApiResponse<T>>(url, data)
        return unwrap(res.data)
    },

    patch: async <T>(url: string, data?: any): Promise<T> => {
        const res = await apiClient.patch<ApiResponse<T>>(url, data)
        return unwrap(res.data)
    },

    put: async <T>(url: string, data?: any): Promise<T> => {
        const res = await apiClient.put<ApiResponse<T>>(url, data)
        return unwrap(res.data)
    },

    delete: async <T>(url: string): Promise<T> => {
        const res = await apiClient.delete<ApiResponse<T>>(url)
        return unwrap(res.data)
    },
}