
import { CatalogSyncService } from './replication/catalog/catalog.sync.service.js'
import { InventorySyncService } from './replication/inventory/inventory.service.js'
import { SyncCollections } from './sync.collections.js'

export class SyncService {
    static pull(collection, checkpoint, limit) {
        switch (collection) {
            case SyncCollections.PRODUCT:
            case SyncCollections.CATEGORY:
            case SyncCollections.BRAND:
            case SyncCollections.UNIT:
            case SyncCollections.PRODUCTUNIT:
                return CatalogSyncService.pull(collection, checkpoint, limit)
            case SyncCollections.INVENTORY:
                return InventorySyncService.pull(checkpoint,limit)

            default:
                throw new Error('Unknown collection')
        }
    }

    static push(collection, docs) {
        switch (collection) {
            case SyncCollections.PRODUCT:
            case SyncCollections.CATEGORY:
            case SyncCollections.BRAND:
            case SyncCollections.UNIT:
            case SyncCollections.PRODUCTUNIT:
                return CatalogSyncService.push(collection, docs)
            case SyncCollections.INVENTORY:
                return InventorySyncService.push(docs)

            default:
                throw new Error('Unknown collection')
        }
    }
}
