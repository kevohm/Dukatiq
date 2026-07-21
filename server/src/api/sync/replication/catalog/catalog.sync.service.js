import { SyncCollections } from '../../sync.collections.js'
import { ProductSyncService } from './products/product.sync.service.js'
import { CategorySyncService } from './category/category.sync.service.js'
import { BrandSyncService } from './brand/brand.sync.service.js'
import { UnitSyncService } from './unit/unit.sync.service.js'
import { ProductUnitSyncService } from './product-unit/product.unit.sync.service.js'

export class CatalogSyncService {
    static pull(collection, checkpoint, limit) {
        switch (collection) {
            case SyncCollections.PRODUCT:
                return ProductSyncService.pull(checkpoint, limit)
            case SyncCollections.CATEGORY:
                return CategorySyncService.pull(checkpoint, limit)
            case SyncCollections.BRAND:
                return BrandSyncService.pull(checkpoint, limit)
            case SyncCollections.UNIT:
                return UnitSyncService.pull(checkpoint, limit)
            case SyncCollections.PRODUCTUNIT:
                return ProductUnitSyncService.pull(checkpoint, limit)

            default:
                throw new Error(`Unknown catalog collection: ${collection}`)
        }
    }

    static push(collection, docs) {
        switch (collection) {
            case SyncCollections.PRODUCT:
                return ProductSyncService.push(docs)
            case SyncCollections.CATEGORY:
                return CategorySyncService.push(docs)
            case SyncCollections.BRAND:
                return BrandSyncService.push(docs)
            case SyncCollections.UNIT:
                return UnitSyncService.push(docs)
            case SyncCollections.PRODUCTUNIT:
                return ProductUnitSyncService.push(docs)

            default:
                throw new Error(`Unknown catalog collection: ${collection}`)
        }
    }
}
