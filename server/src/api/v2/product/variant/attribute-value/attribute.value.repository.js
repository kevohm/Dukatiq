import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import { attributeValues } from '../../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'

export class AttributeValueRepository {
    static async getAll() {
        return db.select().from(attributeValues)
    }
    static async getById(id) {
        const [row] = await db
            .select()
            .from(attributeValues)
            .where(eq(attributeValues.id, id))
        if (!row)
            throw new AppError({
                message: 'Attribute Value not found',
                code: ERROR_CODES.ATTRIBUTE_VALUE.NOT_FOUND,
                status: 404,
                meta: { resource: 'attribute-value', id },
            })
        return row
    }
    static async getByValueAttribute(value,attributeId, client = db) {
        const [row] = await client
            .select()
            .from(attributeValues)
            .where(
                and(
                    eq(attributeValues.value, value),
                    eq(attributeValues.attribute_id, attributeId)
                )
            )
        return row
    }
    static async create(data, client = db) {
        const [row] = await client.insert(attributeValues).values(data).returning()
        return row
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.getByValueAttribute(data.value, data.attribute_id, client)) ??
            this.create(data, client)
        )
    }
    static async update(id, data) {
        await db
            .update(attributeValues)
            .set({ ...data, updated_at: new Date() })
            .where(eq(attributeValues.id, id))
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(attributeValues)
            .where(eq(attributeValues.id, id))
            .returning({ id: attributeValues.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete attribute',
                code: ERROR_CODES.ATTRIBUTE_VALUE.DELETE_FAILED,
                status: 500,
                meta: { resource: 'attribute-value', id },
            })
        return row[0]
    }
}
