import { eq } from 'drizzle-orm'
import { db } from '../../../../config/database.js'
import {
    attributes,
    attributeValues,
    products,
    productVariants,
    variantAttributeValues,
} from '../../../../db/schema.js'
import { AppError, ERROR_CODES } from '../../../../errors/app.error.js'
import { AttributeRepository } from './attribute/attribute.repository.js'
import { AttributeValueRepository } from './attribute-value/attribute.value.repository.js'

import crypto from 'crypto'

export class ProductVariantRepository {
    static async getAll() {
        return db.select().from(productVariants)
    }
    static async getById(id) {
        const [row] = await db
            .select()
            .from(productVariants)
            .where(eq(productVariants.id, id))
        if (!row)
            throw new AppError({
                message: 'Product Variant not found',
                code: ERROR_CODES.PRODUCT_VARIANT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product-variant', id },
            })
        return row
    }
    static async getById(id) {
        const [row] = await db
            .select()
            .from(productVariants)
            .where(eq(productVariants.id, id))

        if (!row) {
            throw new AppError({
                message: 'Product Variant not found',
                code: ERROR_CODES.PRODUCT_VARIANT.NOT_FOUND,
                status: 404,
                meta: {
                    resource: 'product-variant',
                    id,
                },
            })
        }

        const variantAttributes = await db
            .select({
                attribute_id: attributes.id,
                name: attributes.name,
                attribute_value_id: attributeValues.id,
                value: attributeValues.value,
            })
            .from(variantAttributeValues)
            .innerJoin(
                attributeValues,
                eq(
                    variantAttributeValues.attribute_value_id,
                    attributeValues.id
                )
            )
            .innerJoin(
                attributes,
                eq(attributeValues.attribute_id, attributes.id)
            )
            .where(eq(variantAttributeValues.variant_id, id))

        return {
            ...row,
            attributes: variantAttributes,
        }
    }
    static async getByName(name, client = db) {
        const [row] = await client
            .select()
            .from(productVariants)
            .where(eq(productVariants.name, name))
        return row
    }
    static async generateSku(data, client = db) {
        const attributes = data.attributes ?? []
        let productName = data?.name
        if (!productName) {
            const [product] = await client
                .select({ name: products.name })
                .from(products)
                .where(eq(products.id, data.product_id))
            productName = product?.name
        }

        let sku = `SKU-${productName}`
            ?.slice(0, 10)
            ?.trim()
            ?.replaceAll(' ', '-')

        attributes?.slice(0, 3)?.forEach((a, idx) => {
            if (idx < 2) {
                sku += '-'
            }
            sku += a?.value?.slice(0, 2)
        })

        sku += '-'
        sku += crypto.randomBytes(64).toString('hex')?.slice(-4)

        return sku?.toUpperCase()
    }

    static async create(data, client = db) {
        const { attributes: variantAttributes = [], ...variantData } = data

        const sku = await this.generateSku(data)

        return await client.transaction(async (tx) => {
            // 1. Create the product variant
            const [variant] = await tx
                .insert(productVariants)
                .values({ ...variantData, sku })
                .returning()

            if (!variant) {
                throw new Error('Failed to create product variant')
            }

            // 2. Add attributes and attribute values
            if (variantAttributes.length > 0) {
                const junctionRows = []

                for (const attribute of variantAttributes) {
                    // Find or create the attribute
                    const attributeRow = await AttributeRepository.findOrCreate(
                        { name: attribute.name },
                        tx
                    )

                    if (!attributeRow) {
                        throw new Error(
                            `Failed to create attribute: ${attribute.name}`
                        )
                    }

                    // Find or create the attribute value
                    const valueRow =
                        await AttributeValueRepository.findOrCreate(
                            {
                                attribute_id: attributeRow.id,
                                value: attribute.value,
                            },
                            tx
                        )

                    if (!valueRow) {
                        throw new Error(
                            `Failed to create attribute value: ${attribute.name}=${attribute.value}`
                        )
                    }

                    // 3. Create variant <-> attribute value relationship
                    junctionRows.push({
                        variant_id: variant.id,
                        attribute_value_id: valueRow.id,
                    })
                }

                await tx.insert(variantAttributeValues).values(junctionRows)
            }

            return variant
        })
    }
    static async findOrCreate(data, client = db) {
        return (
            (await this.getByName(data.name, client)) ??
            this.create(data, client)
        )
    }
    static async update(id, data) {
        await db
            .update(productVariants)
            .set({ ...data, updated_at: new Date() })
            .where(eq(productVariants.id, id))
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(productVariants)
            .where(eq(productVariants.id, id))
            .returning({ id: productVariants.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete product variant',
                code: ERROR_CODES.PRODUCT_VARIANT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product-variant', id },
            })
        return row[0]
    }
}
