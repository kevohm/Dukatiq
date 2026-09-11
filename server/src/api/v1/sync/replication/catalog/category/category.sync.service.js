import { CategorySyncRepository} from './category.sync.repository.js'

export class CategorySyncService {
    static async pull(checkpoint, limit = 100) {
        return CategorySyncRepository.pull(checkpoint, limit)
    }

    static async push(docs) {
        return CategorySyncRepository.push(docs)
    }
}
