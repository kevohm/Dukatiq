import { api } from '../../lib/utils'
import type { CreateSalePayload, Sale } from './types'

export const saleApi = {
    create: (data: CreateSalePayload) => api.post<Sale>('/sale', data),
    getAll: () => api.get<Sale[]>('/sale'),
}
