import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { expenseCategoryApi } from './api'
import type { ExpenseCategory } from './types'

const EXPENSE_CATEGORY_KEY = ['expense-categories']

/* -----------------------------
   GET ALL EXPENSE CATEGORIES
------------------------------*/
export function useExpenseCategories() {
    return useQuery({
        queryKey: EXPENSE_CATEGORY_KEY,
        queryFn: expenseCategoryApi.getAll,
    })
}

/* -----------------------------
   GET SINGLE EXPENSE CATEGORY
------------------------------*/
export function useExpenseCategory(id?: string) {
    return useQuery({
        queryKey: ['expense-category', id],
        queryFn: () => expenseCategoryApi.getOne(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE EXPENSE CATEGORY
------------------------------*/
export function useCreateExpenseCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: expenseCategoryApi.create,

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: EXPENSE_CATEGORY_KEY,
            })
        },

        onError: (error) => {
            if (isAxiosError(error)) {
                return error.response?.data
            }

            return error
        },
    })
}

/* -----------------------------
   UPDATE EXPENSE CATEGORY
------------------------------*/
export function useUpdateExpenseCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Partial<ExpenseCategory>
        }) => expenseCategoryApi.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: EXPENSE_CATEGORY_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['expense-category', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE EXPENSE CATEGORY
------------------------------*/
export function useDeleteExpenseCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => expenseCategoryApi.remove(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: EXPENSE_CATEGORY_KEY,
            })
        },
    })
}
