import { eq } from 'drizzle-orm'
import { db } from '../../../config/database.js'
import { expenseCategories } from '../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ExpenseCategoryRepository {
    static async getAll() { return db.select().from(expenseCategories) }
    static async getById(id) { const [row] = await db.select().from(expenseCategories).where(eq(expenseCategories.id, id)); if (!row) throw new AppError({ message: 'Category not found', code: ERROR_CODES.EXPENSE_CATEGORY.NOT_FOUND, status: 404, meta: { resource: 'expense_category', id } }); return row }
    static async getByName(name, client = db) { const [row] = await client.select().from(expenseCategories).where(eq(expenseCategories.name, name)); return row }
    static async create(data, client = db) { const [row] = await client.insert(expenseCategories).values(data).returning(); return row }
    static async findOrCreate(data, client = db) { return (await this.getByName(data.name, client)) ?? this.create(data, client) }
    static async update(id, data) { await db.update(expenseCategories).set({ ...data, updated_at: new Date() }).where(eq(expenseCategories.id, id)); return this.getById(id) }
    static async delete(id) { const row = await db.delete(expenseCategories).where(eq(expenseCategories.id, id)).returning({ id: expenseCategories.id }); if (!row.length) throw new AppError({ message: 'Failed to delete category', code: ERROR_CODES.EXPENSE_CATEGORY.DELETE_FAILED, status: 500, meta: { resource: 'expense_category', id } }); return row[0] }
}
