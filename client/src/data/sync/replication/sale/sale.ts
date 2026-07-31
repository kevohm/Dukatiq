import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '@/data/sync/replication/sync.collections'
import { replicateCollection } from '../replicate.collection'

export function replicateSale(db: BusinessDatabase) {
    const collection = db.sales
    const name = SyncCollections.SALE

    return replicateCollection({
        name,
        collection,
    })
}
