import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ApiError } from '../../errors/error'
import { saleService } from '@/data/service'

const SALE_KEY = 'SALE'

export function useCreateSale() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: saleService.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            // toast.success('Sale completed successfully')
        },
        onError: (error: ApiError) => {
            const message = error ? error?.message : 'Unable to complete sale.'
            toast.error(message)
        },
    })
}

export function useGetSales(query = {}) {
    return useQuery({
        queryFn: () => saleService.getAll(query),
        queryKey: [SALE_KEY, 'all', query],
    })
}

export function useGetSale(id: string) {
    return useQuery({
        queryFn: () => saleService.getById(id),
        queryKey: [SALE_KEY, 'single', id],
        enabled: !!id,
    })
}
