import { eq, and } from 'drizzle-orm'
import {
    attributeValues,
    variantAttributeValues,
    productVariants,
    attributes,
} from '../../../../../../db/schema.js'
import { SyncCollections } from '../../../sync.collections.js'
import { createSyncRepository } from '../../base.sync.repository.js'
import { db } from '../../../../../../config/database.js'
import { ProductVariantRepository } from '../../../../../v2/product/variant/product.variant.repository.js'



function normalizeAttributes(attrs = {}) {
    return Object.fromEntries(
        Object.entries(attrs)
            .map(([rawName, rawValues]) => {
                const name = rawName.trim().toLowerCase()

                const values = [
                    ...new Set(
                        rawValues
                            .filter((value) => typeof value === 'string')
                            .map((value) => value.trim().toLowerCase())
                            .filter(Boolean)
                    ),
                ]

                return [name, values]
            })
            .filter(([name, values]) => {
                return Boolean(name) && values.length > 0
            })
    )
}
async function beforePush(tx, doc) {
    const { attributes: _attr, ...rest } = doc
    const attrs = normalizeAttributes(_attr)
    const attrValues = []

    for (const [name, values] of Object.entries(attrs)) {
        // Find or create attribute
        let [attribute] = await tx
            .select()
            .from(attributes)
            .where(eq(attributes.name, name))
            .limit(1)

        if (!attribute) {
            ;[attribute] = await tx
                .insert(attributes)
                .values({
                    name,
                })
                .returning()
        }

        if (!attribute) {
            continue
        }

        for (const value of values) {
            // Find or create attribute value
            let [attributeValue] = await tx
                .select()
                .from(attributeValues)
                .where(
                    and(
                        eq(attributeValues.attribute_id, attribute.id),
                        eq(attributeValues.value, value)
                    )
                )
                .limit(1)

            if (!attributeValue) {
                ;[attributeValue] = await tx
                    .insert(attributeValues)
                    .values({
                        attribute_id: attribute.id,
                        value,
                    })
                    .returning()
            }

            if (!attributeValue) {
                continue
            }

            // await tx.insert(variantAttributeValues).values({
            //     variant_id: doc.id,
            //     attribute_value_id: attributeValue.id,
            // })
            attrValues.push(attributeValue.id)
        }
    }

    return { ...rest, data: { attributes: attrs, attrValues } }
}

export const ProductVariantSyncRepository = createSyncRepository({
    table: productVariants,
    collection: SyncCollections.PRODUCT_VARIANT,
    beforePush,
    afterPush: async (tx, doc, data) => {
        const { attributes: attrs = [], attrValues = [] } = data
        for (const attributeValueId of attrValues) {
            const [existing] = await tx
                .select()
                .from(variantAttributeValues)
                .where(
                    and(
                        eq(variantAttributeValues.variant_id, doc.id),
                        eq(
                            variantAttributeValues.attribute_value_id,
                            attributeValueId
                        )
                    )
                )
            if (!existing) {
                await tx.insert(variantAttributeValues).values({
                    variant_id: doc.id,
                    attribute_value_id: attributeValueId,
                })
            }

            const sku = await ProductVariantRepository.generateSku(
                { ...doc, attributes: attrs },
                tx
            )

            await tx
                .update(productVariants)
                .set({ sku, updated_at: new Date() })
                .where(eq(productVariants.id, doc.id))
        }
    },
})
