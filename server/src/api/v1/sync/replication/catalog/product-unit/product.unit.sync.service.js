import { ProductUnitSyncRepository } from './product.unit.sync.repository.js'

export class ProductUnitSyncService {
    static async pull(checkpoint, limit = 100) {
        return ProductUnitSyncRepository.pull(checkpoint, limit)
    }
    static async push(docs) {
        return ProductUnitSyncRepository.push(docs)
    }
}
