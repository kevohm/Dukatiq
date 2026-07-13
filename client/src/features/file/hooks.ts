import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fileApi } from './api'
import type { UploadFileInput } from './types'

const FILE_URL_KEY = ['file-url'] as const

const refreshDelay = (expiresIn: number) =>
    Math.max((expiresIn - 60) * 1000, 30_000)

export function useUploadFile() {
    return useMutation({
        mutationFn: (input: UploadFileInput) => fileApi.upload(input),
    })
}

export function useDeleteFile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: fileApi.remove,
        onSuccess: (_, key) => {
            queryClient.removeQueries({ queryKey: [...FILE_URL_KEY, key] })
        },
    })
}

export function useFileUrl(
    key?: string | null,
    expiresIn = 3600
) {
    return useQuery({
        queryKey: [...FILE_URL_KEY, key, expiresIn],
        queryFn: () => fileApi.getUrl(key!, expiresIn),
        enabled: Boolean(key),
        staleTime: refreshDelay(expiresIn),
        refetchInterval: (query) => {
            const result = query.state.data
            return result ? refreshDelay(result.expires_in) : false
        },
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    })
}
