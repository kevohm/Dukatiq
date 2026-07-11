import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { expenseApi } from './api'
import type { Expense, IExpenseUpdatePayload } from './types'

const EXPENSE_KEY = ['expenses']

/* -----------------------------
   GET ALL EXPENSES
------------------------------*/
export function useExpenses() {
    return useQuery({
        queryKey: EXPENSE_KEY,
        queryFn: expenseApi.getAll,
    })
}

/* -----------------------------
   GET SINGLE EXPENSE
------------------------------*/
export function useExpense(id?: string) {
    return useQuery({
        queryKey: ['expense', id],
        queryFn: () => expenseApi.getOne(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE EXPENSE
------------------------------*/
export function useCreateExpense() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: expenseApi.create,

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: EXPENSE_KEY,
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
   UPDATE EXPENSE
------------------------------*/
export function useUpdateExpense() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: IExpenseUpdatePayload
        }) => expenseApi.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: EXPENSE_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['expense', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE EXPENSE
------------------------------*/
export function useDeleteExpense() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => expenseApi.remove(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: EXPENSE_KEY,
            })
        },
    })
}
