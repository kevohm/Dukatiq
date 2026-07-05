import { sequelize } from '../../config/database.js'
import { InventoryRepository } from '../inventory/inventory.repository.js'
import { Sale } from './sale.model.js'
import { SaleItem } from './saleItem/sale.item.model.js'

export class SaleRepository {
    static async create(data, transaction = null) {
        const t = transaction ?? (await sequelize.transaction())

        try {
            const { payment_method, totals, items } = data

            // -----------------------------
            // 1. CREATE SALE
            // -----------------------------
            const sale = await Sale.create(
                {
                    payment_method,
                    total_amount: totals.total_amount,
                    total_profit: totals.total_profit,
                },
                { transaction: t }
            )

            // -----------------------------
            // 2. CREATE ITEMS
            // -----------------------------
            await SaleItem.bulkCreate(
                items.map((item) => ({
                    ...item,
                    sale_id: sale.id,
                })),
                { transaction: t }
            )

            // -----------------------------
            // 3. BUILD INVENTORY BATCH
            // -----------------------------
            const inventoryBatch = items.map((item) => ({
                product_id: item.product_id,
                unit_id: item.unit_id,
                type: 'stock_out',
                quantity: item.quantity,
                normalized_quantity: item.normalized_quantity,
                reference_type: 'sale',
                reference_id: sale.id,
            }))

            // -----------------------------
            // 4. APPLY BULK INVENTORY LOGIC
            // -----------------------------
            await InventoryRepository.bulkCreate(inventoryBatch, t)

            await t.commit()

            return sale
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    static async update(id, data, transaction) {
        return Sale.update(data, { where: { id }, transaction })
    }

    static async findById(id) {
        return Sale.findByPk(id, {
            include: [
                {
                    model: SaleItem,
                    as: 'items',
                },
            ],
        })
    }

    static async getAll() {
        return Sale.findAll({
            include: [
                {
                    model: SaleItem,
                    as: 'items',
                },
            ],
            // limit
            // offset
            // order
            order: [['createdAt', 'DESC']],
        })
    }
}
