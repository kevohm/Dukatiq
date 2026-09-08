import { ProductSyncRepository} from './product.sync.repository.js'

export class ProductSyncService {
    static async pull(checkpoint, limit = 100) {
        return ProductSyncRepository.pull(checkpoint, limit)
    }

    static async push(docs) {
        return ProductSyncRepository.push(docs)
    }
}
