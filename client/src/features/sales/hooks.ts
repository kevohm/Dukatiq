import { useMutation } from '@tanstack/react-query'
import { saleApi } from './api'
import toast from 'react-hot-toast'

export function useCreateSale() {
    return useMutation({
        mutationFn: saleApi.create,
        onSuccess: () => {
            toast.success('Sale completed successfully')
        },
        onError: (error: unknown) => {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to complete sale.'
            toast.error(message)
        },
    })
}
