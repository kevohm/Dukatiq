import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '@/data/sync/replication/sync.collections'
import { replicateCollection } from '../replicate.collection'

export function replicateSaleItem(db: BusinessDatabase) {
    const collection = db.saleItems
    const name = SyncCollections.SALEITEM

    return replicateCollection({
        name,
        collection,
    })
}
