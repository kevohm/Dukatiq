import { and, asc, eq, gt, or } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import { SyncCollections } from '../../sync.collections.js'
import { inventory, products, units } from '../../../../db/schema.js'
import { SyncCheckpointService } from '../../repositories/sync-checkpoint.service.js'
import { InventoryService } from '../../../inventory/inventory.service.js'

export class InventorySyncRepository {
    static collection = SyncCollections.INVENTORY

    static async pull(checkpoint, limit = 100) {
        const currentCheckpoint = await SyncCheckpointService.resolve(
            this.collection,
            checkpoint
        )

        let query = db.select().from(inventory)

        if (currentCheckpoint) {
            query = query.where(
                or(
                    gt(inventory.updated_at, currentCheckpoint.updatedAt),
                    and(
                        eq(inventory.updated_at, currentCheckpoint.updatedAt),
                        gt(inventory.id, currentCheckpoint.id)
                    )
                )
            )
        }

        const documents = await query
            .orderBy(asc(inventory.updated_at), asc(inventory.id))
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

            await db.transaction(async (tx) => {
                let unitId = doc.unit_id

                if (unitId) {
                    const unit = await tx
                        .select()
                        .from(units)
                        .where(
                            or(
                                eq(units.id, unitId),
                                eq(units.name, doc.unit_name)
                            )
                        )
                        .limit(1)

                    if (unit.length && unit[0].name === doc.unit_name) {
                        unitId = unit[0].id
                    }
                }

                let productId = doc.product_id

                if (productId) {
                    const product = await tx
                        .select()
                        .from(products)
                        .where(eq(products.id, productId))
                        .limit(1)

                    if (!product.length) {
                        // Product hasn't been synced yet.
                        return
                    }

                    productId = product[0].id
                }

                const { unit_name, ...rest } = doc

                const inventoryData = {
                    ...rest,
                    unit_id: unitId,
                    product_id: productId,
                }

                const existing = await tx
                    .select()
                    .from(inventory)
                    .where(eq(inventory.id, doc.id))
                    .limit(1)

                if (!existing.length) {
                    await tx.insert(inventory).values(inventoryData)
                } else {
                    const current = existing[0]

                    if (
                        new Date(doc.updated_at) > new Date(current.updated_at)
                    ) {
                        await tx
                            .update(inventory)
                            .set(inventoryData)
                            .where(eq(inventory.id, doc.id))
                    } else {
                        conflicts.push({
                            assumedMasterState: current,
                            newDocumentState: doc,
                        })
                        return
                    }
                }

                // Keep product stock in sync
                if (productId) {
                    await InventoryService.recalculateProductStock(
                        tx,
                        productId
                    )
                }
            })
        }

        return conflicts
    }
}
