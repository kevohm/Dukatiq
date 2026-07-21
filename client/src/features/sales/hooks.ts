import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { ApiError } from '../../errors/error'
import { saleService } from '@/data/service'

export function useCreateSale() {
    return useMutation({
        mutationFn: saleService.create,
        onSuccess: () => {
            toast.success('Sale completed successfully')
        },
        onError: (error: ApiError) => {
            const message = error ? error?.message : 'Unable to complete sale.'
            toast.error(message)
        },
    })
}
