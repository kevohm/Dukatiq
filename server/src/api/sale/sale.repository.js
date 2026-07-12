import { db } from '../../config/database.js'
import { Sale } from '../../entities/sale/sale.model.js'
import { SaleItem } from '../../entities/sale/saleItem/sale.item.model.js'
import { InventoryRepository } from '../inventory/inventory.repository.js'


export class SaleRepository {
    static repo = db.getRepository(Sale)
    static saleItemRepo = db.getRepository(SaleItem)

    static async create(data, transactionManager = null) {
        const queryRunner = transactionManager ? null : db.createQueryRunner()

        if (queryRunner) {
            await queryRunner.connect()
            await queryRunner.startTransaction()
        }

        const manager = transactionManager ?? queryRunner.manager

        try {
            const { payment_method, totals, items } = data

            // -----------------------------
            // 1. CREATE SALE
            // -----------------------------
            const sale = await manager.save(
                Sale,
                manager.create(Sale, {
                    payment_method,
                    total_amount: totals.total_amount,
                    total_profit: totals.total_profit,
                })
            )

            // -----------------------------
            // 2. CREATE ITEMS
            // -----------------------------
            const saleItems = items.map((item) =>
                manager.create(SaleItem, {
                    quantity: item.quantity,
                    selling_price: item.selling_price,
                    cost_price: item.cost_price,
                    profit: item.profit,

                    sale: {
                        id: sale.id,
                    },

                    product: {
                        id: item.product_id,
                    },

                    unit: {
                        id: item.unit_id,
                    },
                })
            )

            await manager.save(SaleItem, saleItems)

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
            await InventoryRepository.bulkCreate(inventoryBatch, manager)

            if (queryRunner) {
                await queryRunner.commitTransaction()
            }

            return sale
        } catch (error) {
            if (queryRunner) {
                await queryRunner.rollbackTransaction()
            }

            throw error
        } finally {
            if (queryRunner) {
                await queryRunner.release()
            }
        }
    }

    static async update(id, data, manager = this.repo.manager) {

        await manager.update(id, data)

        return manager.findOne({
            where: { id },
        })
    }

    static async findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: {
                items: true,
            },
        })
    }

    static async getAll() {
        return this.repo.find({
            relations: {
                items: true,
            },
            order: {
                created_at: 'DESC',
            },
        })
    }
}
