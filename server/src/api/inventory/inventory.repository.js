import { Inventory } from './inventory.model.js'
import { Product } from '../product/product.model.js'
import { Unit } from '../product/unit/unit.model.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { sequelize } from '../../config/database.js'
import { ProductRepository } from '../product/product.repository.js'
import {
    buildInventoryEntry,
    calculateStockChange,
} from '../../utils/inventory/inventory.utils.js'

export class InventoryRepository {
    // 🔹 Get all inventory events
    static async getAll() {
        return await Inventory.findAll({
            include: [Product, Unit],
            order: [['createdAt', 'DESC']],
        })
    }

    // 🔹 Get events for a specific product
    static async getByProduct(productId) {
        return await Inventory.findAll({
            where: { product_id: productId },
            include: [Unit],
            order: [['createdAt', 'DESC']],
        })
    }

    // 🔹 Create inventory event (core method)
    static async create(data, transaction = null) {
        // nomarlized_quantity and quantity are always positive
        // change is used to alter stock only
        const t = transaction || (await sequelize.transaction())

        try {
            const entry = buildInventoryEntry(data)
            // 1. Create inventory log (ledger)
            const inventory = await Inventory.create(entry, { transaction: t })

            // 2. Determine stock change
            const change = calculateStockChange(data)

            // 3. Update product stock
            await ProductRepository.applyStockChange({
                id: data?.product_id,
                quantity: change,
                transaction: t,
            })

            if (!transaction) await t.commit()

            return inventory
        } catch (error) {
            if (!transaction) await t.rollback()
            throw error
        }
    }

    // 🔹 Bulk create (useful for sync / imports)
    static async bulkCreate(dataArray, transaction = null) {
        // nomarlized_quantity and quantity are always positive
        // change is used to alter stock only
        const t = transaction || (await sequelize.transaction())
        try {
            // 1. Insert inventory logs
            const records = await Inventory.bulkCreate(dataArray, {
                transaction: t,
                validate: true,
            })

            // 2. Aggregate stock changes per product
            const stockMap = {}

            for (const item of dataArray) {
                const change = calculateStockChange(item)

                if (!stockMap[item.product_id]) {
                    stockMap[item.product_id] = 0
                }

                stockMap[item.product_id] += change
            }

            // 3. Apply updates per product
            for (const [productId, change] of Object.entries(stockMap)) {
                await ProductRepository.applyStockChange({
                    id: productId,
                    quantity: change,
                    transaction: t,
                })
            }

            if (!transaction) await t.commit()

            return records
        } catch (error) {
            if (!transaction) await t.rollback()
            throw error
        }
    }

    // 🔹 Delete event (rare, usually avoid in audit systems)
    static async delete(id) {
        const deleted = await Inventory.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete inventory record',
                code: ERROR_CODES.INVENTORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'inventory', id },
            })
        }
        return deleted
    }

    // 🔹 Get computed stock (IMPORTANT)
    static async getStock(productId) {
        const result = await Inventory.findAll({
            where: { product_id: productId },
            attributes: [
                [
                    Inventory.sequelize.fn(
                        'SUM',
                        Inventory.sequelize.col('normalized_quantity')
                    ),
                    'total_stock',
                ],
            ],
            raw: true,
        })

        return Number(result[0]?.total_stock || 0)
    }

    // 🔹 Get low stock products (based on Product threshold)
    static async getLowStockProducts() {
        const products = await Product.findAll({
            include: [
                {
                    model: Inventory,
                    attributes: [],
                },
            ],
            attributes: [
                'id',
                'name',
                'low_stock_threshold',
                [
                    Inventory.sequelize.fn(
                        'SUM',
                        Inventory.sequelize.col(
                            'Inventories.normalized_quantity'
                        )
                    ),
                    'stock',
                ],
            ],
            group: ['Product.id'],
            having: Inventory.sequelize.literal('stock <= low_stock_threshold'),
        })

        return products
    }

    // 🔹 Adjust stock (wrapper for manual corrections)
    static async adjustStock(
        {
            product_id,
            unit_id,
            quantity,
            normalized_quantity,
            reason = 'manual_adjustment',
        },
        transaction = null
    ) {
        return await this.create(
            {
                product_id,
                unit_id,
                type: 'adjustment',
                quantity,
                normalized_quantity,
                reference_type: reason,
            },
            transaction
        )
    }
}
