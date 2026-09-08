import { and, asc, eq, gt, or } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import { products, productUnits, units } from '../../../../../db/schema.js'
import { SyncCheckpointRepository } from '../../../repositories/sync-checkpoint.repository.js'
import { SyncCollections } from '../../../sync.collections.js'
import { SyncCheckpointService } from '../../../repositories/sync-checkpoint.service.js'
import { createSyncRepository } from '../../base.sync.repository.js'

async function beforePush(tx, doc) {
    let unitId = doc?.unit_id
    if (unitId) {
        const unit = await tx
            .select()
            .from(units)
            .where(or(eq(units.id, unitId), eq(units.name, doc?.unit_name)))
        console.log(unit)
        if (unit.length > 0 && unit[0]?.name === doc?.unit_name) {
            unitId = unit[0]?.id
        }
    }
    let productId = doc?.product_id
    if (productId) {
        const product = await tx
            .select()
            .from(products)
            .where(eq(products.id, productId))
        if (product.length > 0) {
            productId = product[0]?.id
        }
    }
    const { unit_name, ...rest } = doc
    return {
        ...rest,
        unit_id: unitId,
        product_id: productId,
    }
}

export const ProductUnitSyncRepository = createSyncRepository({
    table: productUnits,
    collection: SyncCollections.PRODUCTUNIT,
    uniqueKeys:["product_id","unit_id"],
    beforePush
})