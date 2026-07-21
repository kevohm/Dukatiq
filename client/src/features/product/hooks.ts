import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type {  IProductUpdatePayload } from './types'
import { isAxiosError } from 'axios'
import { productService } from '@/data/service'

const PRODUCT_KEY = ['products']

/* -----------------------------
   GET ALL PRODUCTS
------------------------------*/
export function useProducts() {
    return useQuery({
        queryKey: PRODUCT_KEY,
        queryFn: productService.getAll,
    })
}

/* -----------------------------
   GET SINGLE PRODUCT
------------------------------*/
export function useProduct(id?: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE PRODUCT
------------------------------*/
export function useCreateProduct() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PRODUCT_KEY })
        },
        onError: (error) => {
            console.log(error)
            if (isAxiosError(error)) {
                return error.response?.data
            } else {
                return error
            }
        },
    })
}

/* -----------------------------
   UPDATE PRODUCT
------------------------------*/
export function useUpdateProduct() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: IProductUpdatePayload
        }) => productService.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: PRODUCT_KEY })
            qc.invalidateQueries({
                queryKey: ['product', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE PRODUCT
------------------------------*/
export function useDeleteProduct() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => productService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PRODUCT_KEY })
        },
    })
}
