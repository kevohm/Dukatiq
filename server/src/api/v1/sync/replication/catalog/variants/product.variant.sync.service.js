import { ProductVariantSyncRepository } from './product.variant.sync.repository.js'

export class ProductVariantSyncService {
    static async pull(checkpoint, limit = 100) {
        return ProductVariantSyncRepository.pull(checkpoint, limit)
    }

    static async push(docs) {
        return ProductVariantSyncRepository.push(docs)
    }
}
