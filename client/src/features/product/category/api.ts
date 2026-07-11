import { api } from '../../../lib/utils'
import type { ProductCategory } from './types'

export const productCategoryApi = {
    getAll: () => api.get<ProductCategory[]>('/product-category'),

    getOne: (id?: string) =>
        api.get<ProductCategory>(`/product-category/${id}`),

    create: (data: Partial<ProductCategory>) =>
        api.post<ProductCategory>('/product-category', data),

    update: (id: string, data: Partial<ProductCategory>) =>
        api.patch<ProductCategory>(`/product-category/${id}`, data),

    remove: (id: string) => api.delete(`/product-category/${id}`),
}
