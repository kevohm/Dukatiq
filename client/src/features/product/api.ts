import { api } from '../../lib/utils'
import type { IProductCreatePayload, IProductUpdatePayload, Product } from './types'



export const productApi = {
    getAll: () => api.get<Product[]>('/products'),

    getOne: (id?: string) => api.get<Product>(`/products/${id}`),

    create: (data: IProductCreatePayload) => api.post<Product>('/products', data),

    update: (id: string, data: IProductUpdatePayload) => api.put<Product>(`/products/${id}`, data),

    remove: (id: string) => api.delete(`/products/${id}`),
}
