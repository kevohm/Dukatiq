import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../../config/database.js'
import { inventory, products, units } from '../../db/schema.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { ProductRepository } from '../product/product.repository.js'
import {
    buildInventoryEntry,
    calculateStockChange,
} from '../../utils/inventory/inventory.utils.js'

const eventRow = {
    id: inventory.id,
    created_at: inventory.created_at,
    updated_at: inventory.updated_at,
    type: inventory.type,
    quantity: inventory.quantity,
    normalized_quantity: inventory.normalized_quantity,
    adjustment_type: inventory.adjustment_type,
    reference_type: inventory.reference_type,
    reference_id: inventory.reference_id,
    product_id: inventory.product_id,
    unit_id: inventory.unit_id,
    product: products,
    unit: units,
}
export class InventoryRepository {
    static async getAll() {
        return db
            .select(eventRow)
            .from(inventory)
            .leftJoin(products, eq(inventory.product_id, products.id))
            .leftJoin(units, eq(inventory.unit_id, units.id))
            .orderBy(desc(inventory.created_at))
    }
    static async getByProduct(productId) {
        return db
            .select(eventRow)
            .from(inventory)
            .leftJoin(products, eq(inventory.product_id, products.id))
            .leftJoin(units, eq(inventory.unit_id, units.id))
            .where(eq(inventory.product_id, productId))
            .orderBy(desc(inventory.created_at))
    }
    static async create(data, client = null) {
        return client
            ? this.#createInternal(data, client)
            : db.transaction((tx) => this.#createInternal(data, tx))
    }
    static async #createInternal(data, client) {
        const [saved] = await client
            .insert(inventory)
            .values({
                ...buildInventoryEntry(data),
                product_id: data.product_id,
                unit_id: data.unit_id,
            })
            .returning()
        await ProductRepository.applyStockChange({
            id: data.product_id,
            quantity: calculateStockChange(data),
            client,
        })
        return saved
    }
    static async bulkCreate(dataArray, client = null) {
        return client
            ? this.#bulkCreateInternal(dataArray, client)
            : db.transaction((tx) => this.#bulkCreateInternal(dataArray, tx))
    }
    static async #bulkCreateInternal(dataArray, client) {
        const records = await client
            .insert(inventory)
            .values(
                dataArray.map((item) => ({
                    ...buildInventoryEntry(item),
                    product_id: item.product_id,
                    unit_id: item.unit_id,
                }))
            )
            .returning()
        const changes = new Map()
        for (const item of dataArray)
            changes.set(
                item.product_id,
                (changes.get(item.product_id) ?? 0) + calculateStockChange(item)
            )
        for (const [id, quantity] of changes)
            await ProductRepository.applyStockChange({ id, quantity, client })
        return records
    }
    static async delete(id) {
        const row = await db
            .delete(inventory)
            .where(eq(inventory.id, id))
            .returning({ id: inventory.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete inventory record',
                code: ERROR_CODES.INVENTORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'inventory', id },
            })
        return row[0]
    }
    static async getStock(productId) {
        const [row] = await db
            .select({
                total_stock: sql`COALESCE(SUM(${inventory.normalized_quantity}), 0)`,
            })
            .from(inventory)
            .where(eq(inventory.product_id, productId))
        return Number(row.total_stock)
    }
    static async getLowStockProducts() {
        return db
            .select({
                id: products.id,
                name: products.name,
                low_stock_threshold: products.low_stock_threshold,
                stock: sql`COALESCE(SUM(${inventory.normalized_quantity}), 0)`,
            })
            .from(products)
            .leftJoin(inventory, eq(inventory.product_id, products.id))
            .groupBy(products.id)
            .having(
                sql`COALESCE(SUM(${inventory.normalized_quantity}), 0) <= ${products.low_stock_threshold}`
            )
    }
    static async adjustStock(
        {
            product_id,
            unit_id,
            quantity,
            normalized_quantity,
            reason = 'manual_adjustment',
        },
        client = null
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
            client
        )
    }

    static async recalculateProductStock(tx, productId) {
        const rows = await tx
            .select()
            .from(inventory)
            .where(eq(inventory.product_id, productId))

        const stock = rows.reduce((total, row) => {
            switch (row.type) {
                case 'stock_in':
                    return total + row.normalized_quantity

                case 'stock_out':
                    return total - row.normalized_quantity

                case 'adjustment':
                    if (row.adjustment_type === 'increase') {
                        return total + row.normalized_quantity
                    }

                    if (row.adjustment_type === 'decrease') {
                        return total - row.normalized_quantity
                    }

                    return total

                default:
                    return total
            }
        }, 0)

        await tx
            .update(products)
            .set({
                stock_quantity: stock,
                updated_at: new Date(),
            })
            .where(eq(products.id, productId))
    }
}
