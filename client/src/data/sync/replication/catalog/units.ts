
import type { BusinessDatabase } from '@/data/db/types'

import { replicateCollection } from '../replicate.collection'
import { SyncCollections } from '../sync.collections'

export function replicateUnits(db: BusinessDatabase) {
    return replicateCollection({
                collection: db.units,
                name: SyncCollections.UNIT,
            })
}
