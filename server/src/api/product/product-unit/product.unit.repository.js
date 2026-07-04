import { ProductUnit } from './product.unit.model.js'
import { UnitRepository } from '../unit/unit.repository.js'
import { Op } from 'sequelize'
import { sequelize } from '../../../config/database.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductUnitRepository {
    static async getByProduct(product_id) {
        return ProductUnit.findAll({
            where: { product_id },
        })
    }

    static async getBaseUnit(product_id) {
        return ProductUnit.findOne({
            where: { product_id, is_base_unit: true },
        })
    }

    static async getByUnit(product_id, unit_id, transaction = null) {
        return ProductUnit.findOne({
            where: { product_id, unit_id },
            transaction,
        })
    }

    static async findById(id, transaction = null) {
        return await ProductUnit.findByPk(id, { transaction })
    }
    static async create(data, transaction = null) {
        const base = await this.getBaseUnit(data?.product_id)

        return ProductUnit.create(
            {
                ...data,
                is_base_unit: base ? false : Boolean(data?.is_base_unit),
            },
            { transaction }
        )
    }
    static async findOrCreate(data, transaction = null) {
        console.log(data)
        const productUnit = await this.getByUnit(
            data?.product_id,
            data?.unit_id,
            transaction
        )
        if (!productUnit) {
            return await this.create(data, transaction)
        }
        return productUnit
    }
    static async countActiveUnits(productId, transaction = null) {
        return ProductUnit.count({
            where: {
                product_id: productId,
                is_base_unit: true,
            },
            transaction,
        })
    }

    static async update(id, data) {
        return sequelize.transaction(async (t) => {
            // 1. Update
            const [count] = await ProductUnit.update(data, {
                where: { id },
                individualHooks: true,
                transaction: t,
            })

            // 2. Fetch updated row
            const updated = await ProductUnit.findByPk(id, { transaction: t })
            if (!count) return updated

            // 3. Enforce single base unit
            if (data.is_base_unit === true) {
                await ProductUnit.update(
                    { is_base_unit: false },
                    {
                        where: {
                            product_id: updated.product_id,
                            id: { [Op.ne]: id },
                        },
                        transaction: t,
                    }
                )
            }

            // 4. Ensure at least one base unit exists
            const baseExists = await this.countActiveUnits(
                updated.product_id,
                t
            )

            if (baseExists === 0) {
                await ProductUnit.update(
                    { is_base_unit: true },
                    {
                        where: { id },
                        transaction: t,
                    }
                )
            }

            return updated
        })
    }

    static async delete(id) {
        return sequelize.transaction(async (t) => {
            // 1. Find the unit
            const unit = await ProductUnit.findByPk(id, { transaction: t })

            if (!unit) {
                return {
                    success: false,
                    message: 'Product unit not found',
                }
            }

            const { product_id, is_base_unit } = unit

            // 2. Count total units for this product
            const totalUnits = await ProductUnit.count({
                where: { product_id },
                transaction: t,
            })

            // 3. If this is the only unit → block deletion
            if (totalUnits === 1) {
                return {
                    success: false,
                    message: 'Cannot delete the only unit for a product',
                }
            }

            // 4. Delete the unit
            await ProductUnit.destroy({
                where: { id },
                transaction: t,
            })

            // 5. If it was base → promote another one
            if (is_base_unit) {
                const nextUnit = await ProductUnit.findOne({
                    where: { product_id },
                    order: [['createdAt', 'ASC']], // deterministic choice
                    transaction: t,
                })

                if (nextUnit) {
                    await nextUnit.update(
                        { is_base_unit: true },
                        { transaction: t }
                    )
                }
            }

            return { success: true, message: 'deleted successfully' }
        })
    }

    /**
     * 🔥 This is your most important function
     * Used by inventory logic
     */
    static async convertToBase(product_id, unit_id, quantity) {
        const mapping = await this.getByUnit(product_id, unit_id)

        if (!mapping) {
            throw new AppError({
                message: 'Unit not configured for this product',
                code: ERROR_CODES.PRODUCT_UNIT.NOT_CONFIGURED,
                status: 400,
                meta: { product_id, unit_id },
            })
        }

        return quantity * mapping.conversion_factor
    }
}
