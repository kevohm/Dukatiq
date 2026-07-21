import { InventorySyncRepository } from './inventory.repository.js'

export class InventorySyncService {
    static async pull(checkpoint, limit = 100) {
        return InventorySyncRepository.pull(checkpoint, limit)
    }
    static async push(docs) {
        return InventorySyncRepository.push(docs)
    }

    
}
