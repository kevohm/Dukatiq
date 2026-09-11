import { api } from '../../lib/utils'
import type {
    Expense,
    IExpenseCreatePayload,
    IExpenseUpdatePayload,
} from './types'

export const expenseApi = {
    getAll: () => api.get<Expense[]>('/expense'),

    getOne: (id?: string) => api.get<Expense>(`/expense/${id}`),

    create: (data: IExpenseCreatePayload) =>
        api.post<Expense>('/expense', data),

    update: (id: string, data: IExpenseUpdatePayload) =>
        api.put<Expense>(`/expense/${id}`, data),

    remove: (id: string) => api.delete(`/expense/${id}`),
}
