import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { ProductBrand } from './types'
import { brandService } from '@/data/service'

const PRODUCT_BRAND_KEY = ['product-brands']

/* -----------------------------
   GET ALL PRODUCT BRANDS
------------------------------*/
export function useProductBrands(query = {}) {
    return useQuery({
        queryKey: [...PRODUCT_BRAND_KEY, query],
        queryFn: () => brandService.getAll(query),
    })
}

/* -----------------------------
   GET SINGLE PRODUCT BRAND
------------------------------*/
export function useProductBrand(id?: string) {
    return useQuery({
        queryKey: ['product-brand', id],
        queryFn: () => brandService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE PRODUCT BRAND
------------------------------*/
export function useCreateProductBrand() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: brandService.create,

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
        }) => brandService.update(id, data),

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
        mutationFn: (id: string) => brandService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_BRAND_KEY,
            })
        },
    })
}
