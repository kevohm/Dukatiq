import { eq, or } from 'drizzle-orm'
import { products, saleItems, sales, units } from '../../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'
import { createSyncRepository } from '../../base.sync.repository.js'

async function beforePush(tx, doc) {
    let unitId = doc.unit_id

    if (unitId) {
        const unit = await tx
            .select()
            .from(units)
            .where(or(eq(units.id, unitId), eq(units.name, doc.unit_name)))
            .limit(1)

        if (!unit.length) {
            // Product hasn't been synced yet.
            return
        }
        unitId = unit[0].id
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

    let saleId = doc.sale_id

    if (saleId) {
        const sale = await tx
            .select()
            .from(sales)
            .where(eq(sales.id, saleId))
            .limit(1)

        if (!sale.length) {
            // Product hasn't been synced yet.
            return
        }

        saleId = sale[0].id
    }

    const { unit_name, ...rest } = doc

    return {
        ...rest,
        unit_id: unitId,
        product_id: productId,
        sale_id: saleId,
    }
}

export const SaleItemSyncRepository = createSyncRepository({
    table: saleItems,
    collection: SyncCollections.SALEITEM,
    beforePush
})
