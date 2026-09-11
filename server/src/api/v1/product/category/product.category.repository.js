import { eq } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import { productCategories } from '../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'

export class ProductCategoryRepository {
    static async getAll() {
        return db.select().from(productCategories)
    }
    static async getById(id) {
        const [row] = await db
            .select()
            .from(productCategories)
            .where(eq(productCategories.id, id))
        if (!row)
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: 404,
                meta: { resource: 'product_category', id },
            })
        return row
    }
    static async getByName(name, client = db) {
        const [row] = await client
            .select()
            .from(productCategories)
            .where(eq(productCategories.name, name))
        return row
    }
    static async create(data, client = db) {
        const [row] = await client
            .insert(productCategories)
            .values(data)
            .returning()
        return row
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.getByName(data.name, client)) ??
            this.create(data, client)
        )
    }
    static async update(id, data) {
        await db
            .update(productCategories)
            .set({ ...data, updated_at: new Date() })
            .where(eq(productCategories.id, id))
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(productCategories)
            .where(eq(productCategories.id, id))
            .returning({ id: productCategories.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete category',
                code: ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product_category', id },
            })
        return row[0]
    }
}
