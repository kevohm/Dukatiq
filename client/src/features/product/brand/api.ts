import { api } from '../../../lib/utils'
import type { ProductBrand } from './types'

export const productBrandApi = {
    getAll: () => api.get<ProductBrand[]>('/product-brand'),

    getOne: (id?: string) => api.get<ProductBrand>(`/product-brand/${id}`),

    create: (data: Partial<ProductBrand>) =>
        api.post<ProductBrand>('/product-brand', data),

    update: (id: string, data: Partial<ProductBrand>) =>
        api.patch<ProductBrand>(`/product-brand/${id}`, data),

    remove: (id: string) => api.delete(`/product-brand/${id}`),
}
