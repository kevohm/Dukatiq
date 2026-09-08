import { eq, or, gt, and, asc } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import {
    brands,
    productCategories,
    products,
} from '../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'
import { SyncCheckpointRepository } from '../../../repositories/sync-checkpoint.repository.js'
import { SyncCheckpointService } from '../../../repositories/sync-checkpoint.service.js'
import { createSyncRepository } from '../../base.sync.repository.js'

async function beforePush(tx, doc) {
    let categoryId = doc.category_id

    if (categoryId) {
        const category = await tx
            .select({ id: productCategories.id })
            .from(productCategories)
            .where(
                or(
                    eq(productCategories.id, categoryId),
                    eq(productCategories.name, doc?.category_name)
                )
            )
            .limit(1)

        if (category.length) {
            categoryId = category[0]?.id
        }
    }

    let brandId = doc.brand_id

    if (brandId) {
        const brand = await tx
            .select({ id: brands.id })
            .from(brands)
            .where(or(eq(brands.id, brandId), eq(brands.name, doc?.brand_name)))
            .limit(1)

        if (brand.length) {
            brandId = brand[0]?.id
        }
    }

    return {
        ...doc,
        category_id: categoryId,
        brand_id: brandId,
    }
}

export const ProductSyncRepository = createSyncRepository({
    table: products,
    collection: SyncCollections.PRODUCT,
    beforePush
})
