import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { ProductCategory } from './types'
import { productCategoryService } from '@/data/service'

const PRODUCT_CATEGORY_KEY = ['product-categories']

/* -----------------------------
   GET ALL PRODUCT CATEGORIES
------------------------------*/
export function useProductCategories() {
    return useQuery({
        queryKey: PRODUCT_CATEGORY_KEY,
        queryFn: productCategoryService.getAll,
    })
}

/* -----------------------------
   GET SINGLE PRODUCT CATEGORY
------------------------------*/
export function useProductCategory(id?: string) {
    return useQuery({
        queryKey: ['product-category', id],
        queryFn: () => productCategoryService.getById(id),
        enabled: !!id,
    })
}

/* -----------------------------
   CREATE PRODUCT CATEGORY
------------------------------*/
export function useCreateProductCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: productCategoryService.create,

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_CATEGORY_KEY,
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
   UPDATE PRODUCT CATEGORY
------------------------------*/
export function useUpdateProductCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Partial<ProductCategory>
        }) => productCategoryService.update(id, data),

        onSuccess: (_, variables) => {
            qc.invalidateQueries({
                queryKey: PRODUCT_CATEGORY_KEY,
            })

            qc.invalidateQueries({
                queryKey: ['product-category', variables.id],
            })
        },
    })
}

/* -----------------------------
   DELETE PRODUCT CATEGORY
------------------------------*/
export function useDeleteProductCategory() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => productCategoryService.delete(id),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: PRODUCT_CATEGORY_KEY,
            })
        },
    })
}
