import { and, asc, eq, gt, or } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import { SyncCollections } from '../../sync.collections.js'
import { inventory, products, sales, units } from '../../../../db/schema.js'
import { SyncCheckpointService } from '../../repositories/sync-checkpoint.service.js'
import { InventoryService } from '../../../inventory/inventory.service.js'
import { createSyncRepository } from '../base.sync.repository.js'


export const SaleSyncRepository  = createSyncRepository({
    table: sales,
    collection: SyncCollections.SALE
})
