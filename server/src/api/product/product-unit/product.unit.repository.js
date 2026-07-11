import { db } from '../../../config/database.js'
import {ProductUnit} from '../../../entities/product/product.unit.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductUnitRepository {
    static repo = db.getRepository(ProductUnit)

    static async getByProduct(product_id) {
        return this.repo.find({
            where: {
                product: {
                    id: product_id,
                },
            },
            relations: {
                unit: true,
            },
        })
    }

    static async getBaseUnit(product_id) {
        return this.repo.findOne({
            where: {
                product: {
                    id: product_id,
                },
                is_base_unit: true,
            },
        })
    }

    static async getByUnit(product_id, unit_id) {
        return this.repo.findOne({
            where: {
                product: {
                    id: product_id,
                },
                unit: {
                    id: unit_id,
                },
            },
        })
    }

    static async findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: {
                product: true,
                unit: true,
            },
        })
    }

    static async create(data, manager = this.repo.manager) {
        const base = await this.getBaseUnit(data.product_id)

        const entity = manager.create(ProductUnit,{
            conversion_factor: data.conversion_factor,
            is_base_unit: base ? false : Boolean(data.is_base_unit),

            product: {
                id: data.product_id,
            },

            unit: {
                id: data.unit_id,
            },
        })

        return manager.save(ProductUnit, entity)
    }

    static async findOrCreate(data, manager = this.repo.manager) {
        const productUnit = await this.getByUnit(data.product_id, data.unit_id)

        if (!productUnit) {
            return this.create(data, manager)
        }

        return productUnit
    }

    static async countActiveUnits(productId) {
        return this.repo.count({
            where: {
                product: {
                    id: productId,
                },
                is_base_unit: true,
            },
        })
    }
}
