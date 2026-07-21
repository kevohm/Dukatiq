import { and, asc, eq, gt, or } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import { products, productUnits, units } from '../../../../../db/schema.js'
import { SyncCheckpointRepository } from '../../../repositories/sync-checkpoint.repository.js'
import { SyncCollections } from '../../../sync.collections.js'
import { SyncCheckpointService } from '../../../repositories/sync-checkpoint.service.js'

export class ProductUnitSyncRepository {
    static collection = SyncCollections.PRODUCTUNIT
    static async pull(checkpoint, limit = 100) {
        const currentCheckpoint = await SyncCheckpointService.resolve(
            this.collection,
            checkpoint
        )
        let query = db.select().from(productUnits)

        if (currentCheckpoint) {
            query = query.where(
                or(
                    gt(productUnits.updated_at, currentCheckpoint.updatedAt),
                    and(
                        eq(
                            productUnits.updated_at,
                            currentCheckpoint.updatedAt
                        ),
                        gt(productUnits.id, currentCheckpoint.id)
                    )
                )
            )
        }

        const documents = await query
            .orderBy(asc(productUnits.updated_at), asc(productUnits.id))
            .limit(limit)

        const newCheckpoint = await SyncCheckpointService.update(
            this.collection,
            documents
        )

        return {
            documents,
            checkpoint: newCheckpoint ?? currentCheckpoint,
        }
    }

    static async push(docs) {
        const conflicts = []
        for (const row of docs) {
            const doc = row.newDocumentState
            let unitId = doc?.unit_id
            if (unitId) {
                const unit = await db
                    .select()
                    .from(units)
                    .where(
                        or(eq(units.id, unitId), eq(units.name, doc?.unit_name))
                    )
                console.log(unit)
                if (unit.length > 0 && unit[0]?.name === doc?.unit_name) {
                    unitId = unit[0]?.id
                }
            }
            let productId = doc?.product_id
            if (productId) {
                const product = await db
                    .select()
                    .from(products)
                    .where(eq(products.id, productId))
                console.log(product)
                if (product.length > 0) {
                    productId = product[0]?.id
                }
            }
            const { unit_name, ...rest } = doc
            const productUnit = {
                ...rest,
                unit_id: unitId,
                product_id: productId,
            }
            console.log(productUnit)
            const existing = await db
                .select()
                .from(productUnits)
                .where(
                    and(
                        eq(productUnits.product_id, productId),
                        eq(productUnits.unit_id, unitId)
                    )
                )
                .limit(1)

            if (!existing.length) {
                await db.insert(productUnits).values(productUnit)
                continue
            }

            const current = existing[0]

            if (new Date(doc.updated_at) > new Date(current.updated_at)) {
                await db
                    .update(productUnits)
                    .set(productUnit)
                    .where(
                        and(
                            eq(productUnits.product_id, doc.product_id),
                            eq(productUnits.unit_id, doc.unit_id)
                        )
                    )
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
