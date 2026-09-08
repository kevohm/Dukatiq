import { createSyncRepository } from '../../base.sync.repository.js'
import { brands } from '../../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'


export const BrandSyncRepository = createSyncRepository({
    table: brands,
    collection: SyncCollections.BRAND,
    uniqueField: ['name',"id"],
})
