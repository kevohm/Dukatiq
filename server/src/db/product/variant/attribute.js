import { pgTable, varchar, uuid, unique } from 'drizzle-orm/pg-core'
import { audit } from '../../base.js'
import { relations } from 'drizzle-orm/_relations'

// Attribute Types (e.g., "Color", "Size")
export const attributes = pgTable('attribute', {
    ...audit,
    name: varchar('name').notNull().unique(),
})

// Attribute Values (e.g., "Green", "Small")
export const attributeValues = pgTable(
    'attribute_value',
    {
        ...audit,
        attribute_id: uuid('attribute_id')
            .notNull()
            .references(() => attributes.id, { onDelete: 'cascade' }),
        value: varchar('value').notNull(),
    },
    (table) => [unique('attr_val_unique').on(table.attribute_id, table.value)]
)

export const attributesRelations = relations(attributes, ({ many }) => ({
    values: many(attributeValues),
}))

export const attributeValuesRelations = relations(
    attributeValues,
    ({ one }) => ({
        attribute: one(attributes, {
            fields: [attributeValues.attribute_id],
            references: [attributes.id],
        }),
    })
)
