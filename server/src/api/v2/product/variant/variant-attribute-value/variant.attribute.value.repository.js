import { and, eq } from 'drizzle-orm'
import { db } from '../../../../../config/database.js'
import { variantAttributeValues } from '../../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../../errors/app.error.js'

export class VariantAttributeValueRepository {
    static async getByVariantAttributeValue(data, client = db) {
        const [row] = await client
            .select()
            .from(variantAttributeValues)
            .where(
                and(
                    eq(variantAttributeValues.variant_id, data?.variant_id),
                    eq(
                        variantAttributeValues.attribute_value_id,
                        data?.attribute_value_id
                    )
                )
            )
        return row
    }
    static async create(data, client = db) {
        const [row] = await client
            .insert(variantAttributeValues)
            .values(data)
            .returning()
        return row
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.getByVariantAttributeValue(data, client)) ??
            this.create(data, client)
        )
    }

    static async delete(data) {
        const row = await db
            .delete(variantAttributeValues)
            .where(
                and(
                    eq(variantAttributeValues.variant_id, data.variant_id),
                    eq(
                        variantAttributeValues.attribute_value_id,
                        data.attribute_value_id
                    )
                )
            )
            .returning()
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete variant attribute value',
                code: ERROR_CODES.VARIANT_ATTRIBUTE_VALUE.DELETE_FAILED,
                status: 500,
                meta: { resource: 'variant-attribute-value', ...data },
            })
        return row[0]
    }
}
