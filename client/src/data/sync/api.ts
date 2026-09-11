import {apiClient} from '@/lib/api-client'

export const syncApi = {
    async pull(collection: string, checkpoint: unknown, limit: number) {
        const { data } = await apiClient.post('/api/sync/pull', {
            collection,
            checkpoint,
            limit,
        })

        return data
    },

    async push(collection: string, docs: unknown[]) {
        const { data } = await apiClient.post('/api/sync/push', {
            collection,
            docs,
        })

        return data
    },
}
