import type { ExpenseCategory } from './category/types'

export type Expense = {
    id: string
    name: string
    amount: number
    category_id: string
    category:ExpenseCategory
    created_at: string
    updated_at: string
}

export interface IExpenseCreatePayload {
    name: string
    category: string
    amount: number
}

export interface IExpenseUpdatePayload {
    name?: string
    category_id?: string
    amount?: number
}
