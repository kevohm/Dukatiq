import { api } from '../../lib/utils'
import type { Product } from './types'

export const productApi = {
    getAll: () => api.get<Product[]>('/products'),

    getOne: (id: string) => api.get<Product>(`/products/${id}`),

    create: (data: Partial<Product>) => api.post<Product>('/products', data),

    update: (id: string, data: Partial<Product>) => api.patch<Product>(`/products/${id}`, data),

    remove: (id: string) => api.delete(`/products/${id}`),
}
