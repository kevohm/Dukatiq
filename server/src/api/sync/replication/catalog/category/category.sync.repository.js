import { createSyncRepository } from '../../base.sync.repository.js'
import { productCategories } from '../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'

export const CategorySyncRepository = createSyncRepository({
    table: productCategories,
    collection:SyncCollections.CATEGORY,
    uniqueField: ['name'],
})
