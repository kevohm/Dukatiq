
import type { BusinessDatabase } from '@/data/db/types'

import { replicateCollection } from '../replicate.collection'
import { SyncCollections } from '../sync.collections'

export function replicateCategory(db: BusinessDatabase) {
    return  replicateCollection({
            collection: db.productCategories,
            name: SyncCollections.CATEGORY,
        })
}
