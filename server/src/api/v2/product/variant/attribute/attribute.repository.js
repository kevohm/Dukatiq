import { eq } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import { attributes } from '../../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'

export class AttributeRepository {
    static async getAll() {
        return db.select().from(attributes)
    }
    static async getById(id) {
        const [row] = await db
            .select()
            .from(attributes)
            .where(eq(attributes.id, id))
        if (!row)
            throw new AppError({
                message: 'Attribute not found',
                code: ERROR_CODES.ATTRIBUTE.NOT_FOUND,
                status: 404,
                meta: { resource: 'attribute', id },
            })
        return row
    }
    static async getByName(name, client = db) {
        const [row] = await client
            .select()
            .from(attributes)
            .where(eq(attributes.name, name))
        return row
    }
    static async create(data, client = db) {
        const [row] = await client.insert(attributes).values(data).returning()
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
            .update(attributes)
            .set({ ...data, updated_at: new Date() })
            .where(eq(attributes.id, id))
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(attributes)
            .where(eq(attributes.id, id))
            .returning({ id: attributes.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete attribute',
                code: ERROR_CODES.ATTRIBUTE.DELETE_FAILED,
                status: 500,
                meta: { resource: 'attribute', id },
            })
        return row[0]
    }
}
