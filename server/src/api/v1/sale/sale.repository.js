import { desc, eq } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { saleItems, sales } from '../../../db/schema.js'
import { InventoryRepository } from '../inventory/inventory.repository.js'

export class SaleRepository {
    static async create(data, client = null) {
        if (client) return this.#createInternal(data, client)
        return db.transaction((tx) => this.#createInternal(data, tx))
    }
    static async #createInternal(data, client) {
        const { payment_method, totals, items } = data
        const [sale] = await client.insert(sales).values({ payment_method, total_amount: totals.total_amount, total_profit: totals.total_profit }).returning()
        await client.insert(saleItems).values(items.map((item) => ({ quantity: item.quantity, selling_price: item.selling_price, cost_price: item.cost_price, profit: item.profit, sale_id: sale.id, product_id: item.product_id, unit_id: item.unit_id })))
        await InventoryRepository.bulkCreate(items.map((item) => ({ product_id: item.product_id, unit_id: item.unit_id, type: 'stock_out', quantity: item.quantity, normalized_quantity: item.normalized_quantity, reference_type: 'sale', reference_id: sale.id })), client)
        return sale
    }
    static async update(id, data, client = db) { await client.update(sales).set({ ...data, updated_at: new Date() }).where(eq(sales.id, id)); return this.findById(id, client) }
    static async findById(id, client = db) { const [sale] = await client.select().from(sales).where(eq(sales.id, id)); if (!sale) return undefined; const items = await client.select().from(saleItems).where(eq(saleItems.sale_id, id)); return { ...sale, items } }
    static async getAll() { const records = await db.select().from(sales).orderBy(desc(sales.created_at)); return Promise.all(records.map((sale) => this.findById(sale.id))) }
}
