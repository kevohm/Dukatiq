import type { BusinessDatabase } from '@/data/db/types'
import { SyncCollections } from '../sync.collections'
import { replicateCollection } from '../replicate.collection'
import type { ProductVariantDoc } from '@/data/models/product/variants/product.variant'

export function replicateProductVariants(db: BusinessDatabase) {
    const collection = db.productVariants
    const name = SyncCollections.PRODUCT_VARIANT

    return replicateCollection<ProductVariantDoc>({
        name,
        collection
    })
}
