import { SaleItemSyncRepository } from "./sale.item.repository.js"

export class SaleItemSyncService {
    static async pull(checkpoint, limit = 100) {
        return SaleItemSyncRepository.pull(checkpoint, limit)
    }
    static async push(docs) {
        return SaleItemSyncRepository.push(docs)
    }

    
}
