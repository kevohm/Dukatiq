import { createSyncRepository } from '../../base.sync.repository.js'
import { brands } from '../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'
import { SyncCheckpointService } from '../../../repositories/sync-checkpoint.service.js'
import { db } from '../../../../../config/database.js'
import { asc, or } from 'drizzle-orm'

export const BrandSyncRepository = createSyncRepository({
    table: brands,
    collection: SyncCollections.BRAND,
    uniqueField: 'name',
})
