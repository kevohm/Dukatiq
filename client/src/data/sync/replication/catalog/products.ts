
import type { BusinessDatabase } from '@/data/db/types'
import { replicateCollection } from '../replicate.collection'
import { SyncCollections } from '../sync.collections'

export function replicateProducts(db: BusinessDatabase) {
    return  replicateCollection({
            collection: db.products,
            name: SyncCollections.PRODUCT,
        })
}
