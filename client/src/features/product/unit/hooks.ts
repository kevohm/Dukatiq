import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { IUnitUpdatePayload } from './types'
import { isAxiosError } from 'axios'
import { unitService } from '@/data/service'

const UNIT_KEY = ['units']

/* -----------------------------
   GET ALL UNITS
------------------------------*/
export function useUnits() {
    return useQuery({
        queryKey: UNIT_KEY,
        queryFn: unitService.getAll,
    })
}

/* -----------------------------
   GET SINGLE UNIT
------------------------------*/
export function useUnit(id?: string) {
    return useQuery({
        queryKey: ['unit', id],
        queryFn: () => unitService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE UNIT
------------------------------*/
export function useCreateUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: unitService.create,

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: UNIT_KEY,
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
   UPDATE UNIT
------------------------------*/
export function useUpdateUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IUnitUpdatePayload }) =>
            unitService.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: UNIT_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['unit', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE UNIT
------------------------------*/
export function useDeleteUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => unitService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: UNIT_KEY,
            })
        },
    })
}
