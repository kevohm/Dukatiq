import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type {  IExpenseUpdatePayload } from './types'
import { expenseService } from '@/data/service'

const EXPENSE_KEY = ['expenses']

/* -----------------------------
   GET ALL EXPENSES
------------------------------*/
export function useExpenses() {
    return useQuery({
        queryKey: EXPENSE_KEY,
        queryFn: expenseService.getAll,
    })
}

/* -----------------------------
   GET SINGLE EXPENSE
------------------------------*/
export function useExpense(id?: string) {
    return useQuery({
        queryKey: ['expense', id],
        queryFn: () => expenseService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE EXPENSE
------------------------------*/
export function useCreateExpense() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: expenseService.create,

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
        }) => expenseService.update(id, data),

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
        mutationFn: (id: string) => expenseService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: EXPENSE_KEY,
            })
        },
    })
}
