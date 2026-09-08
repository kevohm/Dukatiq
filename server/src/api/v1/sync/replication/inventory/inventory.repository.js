import { and, asc, eq, gt, or } from 'drizzle-orm'
import { SyncCollections } from '../../sync.collections.js'
import { inventory, products, units } from '../../../../../db/schema.js'
import { InventoryService } from '../../../inventory/inventory.service.js'
import { createSyncRepository } from '../base.sync.repository.js'

async function beforePush(tx, doc) {
    let unitId = doc.unit_id

    if (unitId) {
        const unit = await tx
            .select()
            .from(units)
            .where(or(eq(units.id, unitId), eq(units.name, doc.unit_name)))
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

    return {
        ...rest,
        unit_id: unitId,
        product_id: productId,
    }
}
async function afterPush(tx, data) {
    if (data?.productId) {
        await InventoryService.recalculateProductStock(tx, data?.productId)
    }
}
export const InventorySyncRepository  = createSyncRepository({
    table: inventory,
    collection: SyncCollections.INVENTORY,
    beforePush,
    afterPush
})
