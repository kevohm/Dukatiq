import { BrandSyncRepository} from './brand.sync.repository.js'

export class BrandSyncService {
    static async pull(checkpoint, limit = 100) {
        return BrandSyncRepository.pull(checkpoint, limit)
    }

    static async push(docs) {
        return BrandSyncRepository.push(docs)
    }
}
