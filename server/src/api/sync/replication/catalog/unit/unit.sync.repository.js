import {  createSyncRepository } from '../../base.sync.repository.js'
import { units } from '../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'

export const UnitSyncRepository = createSyncRepository({
    table: units,
    collection:SyncCollections.UNIT,
    uniqueField: ['name'],
})
