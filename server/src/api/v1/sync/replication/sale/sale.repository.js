
import { SyncCollections } from '../../sync.collections.js'
import { inventory, products, sales, units } from '../../../../../db/schema.js'
import { createSyncRepository } from '../base.sync.repository.js'


export const SaleSyncRepository  = createSyncRepository({
    table: sales,
    collection: SyncCollections.SALE
})
