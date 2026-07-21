import { api } from '../../../lib/utils'
import type { ExpenseCategory } from './types'

export const expenseCategoryApi = {
    getAll: () => api.get<ExpenseCategory[]>('/expense-category'),
    getOne: (id?: string) => api.get<ExpenseCategory>(`/expense-category/${id}`),

    create: (data: Partial<ExpenseCategory>) => api.post<ExpenseCategory>('/expense-category', data),

    update: (id: string, data: Partial<ExpenseCategory>) => api.patch<ExpenseCategory>(`/expense-category/${id}`, data),

    remove: (id: string) => api.delete(`/expense-category/${id}`),
}
