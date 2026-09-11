import { api } from '../../../lib/utils'
import type { Unit } from '../types'
import type { IUnitCreatePayload, IUnitUpdatePayload } from './types'


export const unitApi = {
    getAll: () => api.get<Unit[]>('/products'),

    getOne: (id?: string) => api.get<Unit>(`/products/${id}`),

    create: (data: IUnitCreatePayload) => api.post<Unit>('/products', data),

    update: (id: string, data: IUnitUpdatePayload) => api.put<Unit>(`/products/${id}`, data),

    remove: (id: string) => api.delete(`/products/${id}`),
}
