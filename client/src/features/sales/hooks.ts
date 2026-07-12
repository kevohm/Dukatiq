import { useMutation } from '@tanstack/react-query'
import { saleApi } from './api'
import toast from 'react-hot-toast'
import type { ApiError } from '../../errors/error'

export function useCreateSale() {
    return useMutation({
        mutationFn: saleApi.create,
        onSuccess: () => {
            toast.success('Sale completed successfully')
        },
        onError: (error: ApiError) => {
            const message = error ? error?.message : 'Unable to complete sale.'
            toast.error(message)
        },
    })
}
