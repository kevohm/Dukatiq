
import { CatalogSyncService } from './replication/catalog/catalog.sync.service.js'
import { InventorySyncService } from './replication/inventory/inventory.service.js'
import { SaleSyncService } from './replication/sale/sale.service.js'
import { SaleItemSyncService } from './replication/sale/saleItem/sale.item.service.js'
import { SyncCollections } from './sync.collections.js'

export class SyncService {
    static pull(collection, checkpoint, limit) {
        switch (collection) {
            case SyncCollections.PRODUCT:
            case SyncCollections.CATEGORY:
            case SyncCollections.BRAND:
            case SyncCollections.UNIT:
            case SyncCollections.PRODUCTUNIT:
            case SyncCollections.PRODUCT_VARIANT:
                return CatalogSyncService.pull(collection, checkpoint, limit)
            case SyncCollections.INVENTORY:
                return InventorySyncService.pull(checkpoint, limit)
            case SyncCollections.SALE:
                return SaleSyncService.pull(checkpoint, limit)
            case SyncCollections.SALEITEM:
                return SaleItemSyncService.pull(checkpoint, limit)

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
            case SyncCollections.PRODUCT_VARIANT:
                return CatalogSyncService.push(collection, docs)
            case SyncCollections.INVENTORY:
                return InventorySyncService.push(docs)
            case SyncCollections.SALE:
                return SaleSyncService.push(docs)
            case SyncCollections.SALEITEM:
                return SaleItemSyncService.push(docs)
            default:
                throw new Error('Unknown collection')
        }
    }
}
