import { and, count, eq } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { productUnits, products, units } from '../../../db/schema.js'

export class ProductUnitRepository {
    static async getByProduct(product_id) {
        return db
            .select({ ...productUnits, unit: units })
            .from(productUnits)
            .leftJoin(units, eq(productUnits.unit_id, units.id))
            .where(eq(productUnits.product_id, product_id))
    }
    static async getBaseUnit(product_id, client = db) {
        const [row] = await client
            .select()
            .from(productUnits)
            .where(
                and(
                    eq(productUnits.product_id, product_id),
                    eq(productUnits.is_base_unit, true)
                )
            )
        return row
    }
    static async getByUnit(product_id, unit_id, client = db) {
        const [row] = await client
            .select()
            .from(productUnits)
            .where(
                and(
                    eq(productUnits.product_id, product_id),
                    eq(productUnits.unit_id, unit_id)
                )
            )
        return row
    }
    static async findById(id) {
        const [row] = await db
            .select({ ...productUnits, product: products, unit: units })
            .from(productUnits)
            .leftJoin(products, eq(productUnits.product_id, products.id))
            .leftJoin(units, eq(productUnits.unit_id, units.id))
            .where(eq(productUnits.id, id))
        return row
    }
    static async create(data, client = db) {
        const base = await this.getBaseUnit(data.product_id, client)
        const [row] = await client
            .insert(productUnits)
            .values({
                ...data,
                is_base_unit: base ? false : Boolean(data.is_base_unit),
            })
            .returning()
        return row
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.getByUnit(data.product_id, data.unit_id, client)) ??
            this.create(data, client)
        )
    }
    static async countActiveUnits(productId) {
        const [row] = await db
            .select({ count: count() })
            .from(productUnits)
            .where(
                and(
                    eq(productUnits.product_id, productId),
                    eq(productUnits.is_base_unit, true)
                )
            )
        return Number(row.count)
    }
}
