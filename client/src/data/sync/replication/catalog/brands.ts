
import type { BusinessDatabase } from '@/data/db/types'
import { replicateCollection } from '../replicate.collection'
import { SyncCollections } from '../sync.collections'

export function replicateBrands(db: BusinessDatabase) {
    return  replicateCollection({
        collection: db.brands,
        name: SyncCollections.BRAND,
    })
}
