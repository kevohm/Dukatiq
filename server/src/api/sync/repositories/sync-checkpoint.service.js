import { SyncCheckpointRepository } from '../repositories/sync-checkpoint.repository.js'

export class SyncCheckpointService {
    static async resolve(collection, checkpoint) {
        if (checkpoint) {
            return checkpoint
        }

        return await SyncCheckpointRepository.get(collection)
    }

    static async update(collection, documents) {
        if (!documents.length) {
            return null
        }

        const lastDocument = documents.at(-1)

        const checkpoint = {
            id: lastDocument.id,
            updatedAt: lastDocument.updated_at,
        }

        await SyncCheckpointRepository.save(collection, checkpoint)

        return checkpoint
    }

    static async clear(collection) {
        await SyncCheckpointRepository.clear(collection)
    }

    static async clearAll() {
        await SyncCheckpointRepository.clearAll()
    }
}
