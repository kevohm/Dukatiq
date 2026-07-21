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

export class ProductSyncRepository {
    static collection = SyncCollections.PRODUCT
    static async pull(checkpoint, limit = 100) {
        const currentCheckpoint = await SyncCheckpointService.resolve(this.collection, checkpoint)
        let query = db.select().from(products)

        if (currentCheckpoint) {
            query = query.where(
                or(
                    gt(products.updated_at, currentCheckpoint.updatedAt),
                    and(
                        eq(products.updated_at, currentCheckpoint.updatedAt),
                        gt(products.id, currentCheckpoint.id)
                    )
                )
            )
        }

        const documents = await query
            .orderBy(asc(products.updated_at), asc(products.id))
            .limit(limit)

         const newCheckpoint = await SyncCheckpointService.update(
             this.collection,
             documents
         )

        return {
            documents,
            checkpoint: newCheckpoint ?? currentCheckpoint
        }
    }

    static async push(docs) {
        const conflicts = []

        for (const row of docs) {
            const doc = row.newDocumentState
            let categoryId = doc.category_id

            if (categoryId) {
                const category = await db
                    .select({ id: productCategories.id })
                    .from(productCategories)
                    .where(eq(productCategories.id, categoryId))
                    .limit(1)

                if (!category.length) {
                    categoryId = null
                }
            }

            let brandId = doc.brand_id

            if (brandId) {
                const brand = await db
                    .select({ id: brands.id })
                    .from(brands)
                    .where(eq(brands.id, brandId))
                    .limit(1)

                if (!brand.length) {
                    brandId = null
                }
            }

            const product = {
                ...doc,
                category_id: categoryId,
                brand_id: brandId,
            }
            const existing = await db
                .select()
                .from(products)
                .where(eq(products.id, doc.id))
                .limit(1)

            if (!existing.length) {
                await db.insert(products).values(product)

                continue
            }

            const current = existing[0]

            // Simple last-write-wins
            if (new Date(doc.updated_at) > new Date(current.updated_at)) {
                await db
                    .update(products)
                    .set(product)
                    .where(eq(products.id, doc.id))
            } else {
                conflicts.push({
                    assumedMasterState: current,
                    newDocumentState: doc,
                })
            }
        }

        return conflicts
    }
}
