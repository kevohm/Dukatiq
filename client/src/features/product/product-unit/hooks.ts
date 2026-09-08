import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type {
    IProductUnitCreatePayload,
    IProductUnitUpdatePayload,
} from './types'
import { productUnitService } from '@/data/service'

const PRODUCT_UNIT_KEY = ['productUnits']

/* -----------------------------
   GET ALL PRODUCT UNITS
------------------------------*/
export function useProductUnits() {
    return useQuery({
        queryKey: PRODUCT_UNIT_KEY,
        queryFn: () => productUnitService.getAll(),
    })
}

/* -----------------------------
   GET SINGLE PRODUCT UNIT
------------------------------*/
export function useProductUnit(id?: string) {
    return useQuery({
        queryKey: ['productUnit', id],
        queryFn: () => productUnitService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   GET PRODUCT UNIT BY PRODUCT + UNIT
------------------------------*/
export function useProductUnitByProductAndUnit(
    productId?: string,
    unitId?: string
) {
    return useQuery({
        queryKey: ['productUnit', productId, unitId],
        queryFn: () =>
            productUnitService.getByProductAndUnit(productId, unitId),
        enabled: !!productId && !!unitId,
    })
}

/* -----------------------------
   GET PRODUCT UNIT BY PRODUCT
------------------------------*/
export function useProductUnitByProduct(
    productId?: string,
) {
    return useQuery({
        queryKey: ['productUnit', productId],
        queryFn: () =>
            productUnitService.getByProduct(productId),
        enabled: !!productId
    })
}
/* -----------------------------
   CREATE PRODUCT UNIT
------------------------------*/
export function useCreateProductUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (payload: IProductUnitCreatePayload) =>
            productUnitService.create(payload),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_UNIT_KEY,
            })
        },
    })
}

/* -----------------------------
   UPDATE PRODUCT UNIT
------------------------------*/
export function useUpdateProductUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: IProductUnitUpdatePayload
        }) => productUnitService.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: PRODUCT_UNIT_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['productUnit', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE PRODUCT UNIT
------------------------------*/
export function useDeleteProductUnit() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => productUnitService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_UNIT_KEY,
            })
        },
    })
}
