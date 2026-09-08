import { eq } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { brands } from '../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductBrandRepository {
    static async getAll() { return db.select().from(brands) }
    static async getById(id) { const [row] = await db.select().from(brands).where(eq(brands.id, id)); if (!row) throw new AppError({ message: 'Brand not found', code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND, status: 404, meta: { resource: 'product_brand', id } }); return row }
    static async getByName(name, client = db) { const [row] = await client.select().from(brands).where(eq(brands.name, name)); return row }
    static async create(data, client = db) { const [row] = await client.insert(brands).values(data).returning(); return row }
    static async findOrCreate(data, client = db) { return (await this.getByName(data.name, client)) ?? this.create(data, client) }
    static async update(id, data) { await db.update(brands).set({ ...data, updated_at: new Date() }).where(eq(brands.id, id)); return this.getById(id) }
    static async delete(id) { const row = await db.delete(brands).where(eq(brands.id, id)).returning({ id: brands.id }); if (!row.length) throw new AppError({ message: 'Failed to delete brand', code: ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED, status: 500, meta: { resource: 'product_brand', id } }); return row[0] }
}
