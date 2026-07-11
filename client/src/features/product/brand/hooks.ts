import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { productBrandApi } from './api'
import type { ProductBrand } from './types'

const PRODUCT_BRAND_KEY = ['product-brands']

/* -----------------------------
   GET ALL PRODUCT BRANDS
------------------------------*/
export function useProductBrands() {
    return useQuery({
        queryKey: PRODUCT_BRAND_KEY,
        queryFn: productBrandApi.getAll,
    })
}

/* -----------------------------
   GET SINGLE PRODUCT BRAND
------------------------------*/
export function useProductBrand(id?: string) {
    return useQuery({
        queryKey: ['product-brand', id],
        queryFn: () => productBrandApi.getOne(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE PRODUCT BRAND
------------------------------*/
export function useCreateProductBrand() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productBrandApi.create,

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_BRAND_KEY,
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
   UPDATE PRODUCT BRAND
------------------------------*/
export function useUpdateProductBrand() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Partial<ProductBrand>
        }) => productBrandApi.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: PRODUCT_BRAND_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['product-brand', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE PRODUCT BRAND
------------------------------*/
export function useDeleteProductBrand() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => productBrandApi.remove(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_BRAND_KEY,
            })
        },
    })
}
