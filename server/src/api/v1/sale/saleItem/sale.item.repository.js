import { asc, eq } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import { saleItems } from '../../../../db/schema.js'

export class SaleItemRepository {
    static async create(data, client = db) { const [item] = await client.insert(saleItems).values(data).returning(); return item }
    static async bulkCreate(items, client = db) { return client.insert(saleItems).values(items).returning() }
    static async update(id, data, client = db) { await client.update(saleItems).set({ ...data, updated_at: new Date() }).where(eq(saleItems.id, id)); return this.findById(id, client) }
    static async delete(id, client = db) { return client.delete(saleItems).where(eq(saleItems.id, id)).returning() }
    static async findById(id, client = db) { const [item] = await client.select().from(saleItems).where(eq(saleItems.id, id)); return item }
    static async findBySaleId(sale_id, client = db) { return client.select().from(saleItems).where(eq(saleItems.sale_id, sale_id)).orderBy(asc(saleItems.created_at)) }
    static async deleteBySaleId(sale_id, client = db) { return client.delete(saleItems).where(eq(saleItems.sale_id, sale_id)).returning() }
}
