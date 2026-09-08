import { api } from '../../../lib/utils'
import type { IProductUnitCreatePayload, IProductUnitUpdatePayload, ProductUnit } from './types'


export const productApi = {
    getAll: () => api.get<ProductUnit[]>('/product-unit'),

    getOne: (id?: string) => api.get<ProductUnit>(`/product-unit/${id}`),

    create: (data: IProductUnitCreatePayload) => api.post<ProductUnit>('/product-unit', data),

    update: (id: string, data: IProductUnitUpdatePayload) => api.put<ProductUnit>(`/product-unit/${id}`, data),

    remove: (id: string) => api.delete(`/products/${id}`),
}
