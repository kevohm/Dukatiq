import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core'
import { productVariants } from './product-variant.js'
import { attributeValues } from './attribute.js'
import { relations } from 'drizzle-orm/_relations'

export const variantAttributeValues = pgTable(
    'variant_attribute_value',
    {
        variant_id: uuid('variant_id')
            .notNull()
            .references(() => productVariants.id, { onDelete: 'cascade' }),
        attribute_value_id: uuid('attribute_value_id')
            .notNull()
            .references(() => attributeValues.id, { onDelete: 'cascade' }),
    },
    (table) => [
        primaryKey({ columns: [table.variant_id, table.attribute_value_id] }),
    ]
)

export const variantAttributeValuesRelations = relations(
    variantAttributeValues,
    ({ one }) => ({
        variant: one(productVariants, {
            fields: [variantAttributeValues.variant_id],
            references: [productVariants.id],
        }),
        attributeValue: one(attributeValues, {
            fields: [variantAttributeValues.attribute_value_id],
            references: [attributeValues.id],
        }),
    })
)
