import type { ProductUnitDoc } from '../../models/product/product.unit'
import { BaseRepository } from '../base.repository'

export class ProductUnitRepository extends BaseRepository<ProductUnitDoc> {
    findByProductId(productId: string) {
        return this.collection
            .find({
                selector: {
                    product_id: productId,
                },
            })
            .exec()
            .then((rows) => rows?.map((row) => row?.toJSON()))
    }

    async findByProductIds(productIds: string[]) {
        if (!productIds.length) {
            return []
        }

        return this.collection
            .find({
                selector: {
                    product_id: {
                        $in: productIds,
                    },
                },
            })
            .exec()
            .then((docs) => docs.map((doc) => doc.toJSON()))
    }
    findByUnitId(unitId: string) {
        return this.collection
            .find({
                selector: {
                    unit_id: unitId,
                },
            })
            .exec()
            .then((rows) => rows?.map((row) => row?.toJSON()))
    }

    findBaseUnit(productId: string) {
        return this.collection
            .findOne({
                selector: {
                    product_id: productId,
                    is_base_unit: true,
                },
            })
            .exec()
    }

    async findByProductAndUnit(productId: string, unitId: string) {
        return this.collection
            .findOne({
                selector: {
                    product_id: productId,
                    unit_id: unitId,
                },
            })
            .exec()
            .then((i) => i?.toJSON())
    }

    async setBaseUnit(id: string) {
        const current = await this.findOrThrow(id)

        const baseUnit = await this.findBaseUnit(current.product_id)

        if (baseUnit && baseUnit.id !== id) {
            await baseUnit.incrementalPatch({
                is_base_unit: false,
            })
        }

        return this.update(id, {
            is_base_unit: true,
        })
    }
}
