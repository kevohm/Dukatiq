import { db } from '../../config/database.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { ProductRepository } from '../product/product.repository.js'
import {
    buildInventoryEntry,
    calculateStockChange,
} from '../../utils/inventory/inventory.utils.js'
import { Inventory } from '../../entities/inventory/inventory.model.js'
import { Product } from '../../entities/product/product.model.js'

export class InventoryRepository {
    static repo = db.getRepository(Inventory)

    // 🔹 Get all inventory events
    static async getAll() {
        return this.repo.find({
            relations: {
                product: true,
                unit: true,
            },
            order: {
                created_at: 'DESC',
            },
        })
    }

    // 🔹 Get events for a specific product
    static async getByProduct(productId) {
        return this.repo.find({
            where: {
                product: {
                    id: productId,
                },
            },
            relations: {
                unit: true,
            },
            order: {
                created_at: 'DESC',
            },
        })
    }

    // 🔹 Create inventory event
    static async create(data, manager = this.repo.manager) {
        if (manager) {
            return this.#createInternal(data, manager)
        }

        return db.transaction(async (manager) => {
            return this.#createInternal(data, manager)
        })
    }

    static async #createInternal(data, manager) {

        const entry = buildInventoryEntry(data)

        const inventory = manager.create(Inventory, {
            ...entry,
            product: {
                id: data.product_id,
            },
            unit: {
                id: data.unit_id,
            },
        })

        const saved = await manager.save(Inventory, inventory)

        const change = calculateStockChange(data)

        await ProductRepository.applyStockChange({
            id: data.product_id,
            quantity: change,
            manager,
        })

        return saved
    }

    // 🔹 Bulk create
    static async bulkCreate(dataArray, manager = null) {
        if (manager) {
            return this.#bulkCreateInternal(dataArray, manager)
        }

        return db.transaction(async (manager) => {
            return this.#bulkCreateInternal(dataArray, manager)
        })
    }

    static async #bulkCreateInternal(dataArray, manager) {
        const repo = manager.getRepository(Inventory)

        const entities = dataArray.map((item) =>
            repo.create({
                ...buildInventoryEntry(item),
                product: {
                    id: item.product_id,
                },
                unit: {
                    id: item.unit_id,
                },
            })
        )

        const records = await manager.save(Inventory, entities)

        const stockMap = {}

        for (const item of dataArray) {
            const change = calculateStockChange(item)

            stockMap[item.product_id] =
                (stockMap[item.product_id] || 0) + change
        }

        for (const [productId, change] of Object.entries(stockMap)) {
            await ProductRepository.applyStockChange({
                id: productId,
                quantity: change,
                manager,
            })
        }

        return records
    }

    // 🔹 Delete event
    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete inventory record',
                code: ERROR_CODES.INVENTORY.DELETE_FAILED,
                status: 500,
                meta: {
                    resource: 'inventory',
                    id,
                },
            })
        }

        return result
    }

    // 🔹 Get computed stock
    static async getStock(productId) {
        const result = await this.repo
            .createQueryBuilder('inventory')
            .select(
                'COALESCE(SUM(inventory.normalized_quantity),0)',
                'total_stock'
            )
            .where('inventory.product_id = :productId', {
                productId,
            })
            .getRawOne()

        return Number(result.total_stock)
    }

    // 🔹 Get low stock products
    static async getLowStockProducts() {
        return db
            .getRepository(Product)
            .createQueryBuilder('product')
            .leftJoin('product.inventory', 'inventory')
            .select([
                'product.id',
                'product.name',
                'product.low_stock_threshold',
            ])
            .addSelect(
                'COALESCE(SUM(inventory.normalized_quantity),0)',
                'stock'
            )
            .groupBy('product.id')
            .having('stock <= product.low_stock_threshold')
            .getRawMany()
    }

    // 🔹 Adjust stock
    static async adjustStock(
        {
            product_id,
            unit_id,
            quantity,
            normalized_quantity,
            reason = 'manual_adjustment',
        },
        manager = null
    ) {
        return this.create(
            {
                product_id,
                unit_id,
                type: 'adjustment',
                quantity,
                normalized_quantity,
                reference_type: reason,
            },
            manager
        )
    }
}
