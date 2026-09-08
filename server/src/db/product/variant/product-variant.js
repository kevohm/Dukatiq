import { numeric, pgTable, varchar, uuid, bigint } from 'drizzle-orm/pg-core'
import { audit } from '../../base.js'
import { products } from '../product.js'
import { variantAttributeValues } from './variant-attribute-value.js'
import { relations } from 'drizzle-orm/_relations'

export const productVariants = pgTable('product_variant', {
    ...audit,
    product_id: uuid('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku').unique(), // e.g., "DISH-GRN-SML"
    cost_price: bigint('cost_price', { mode: 'number' }).notNull(),

    selling_price: bigint('selling_price', { mode: 'number' }).notNull(),

    stock_quantity: bigint('stock_quantity', { mode: 'number' })
        .default(0)
        .notNull(),

    low_stock_threshold: bigint('low_stock_threshold', { mode: 'number' })
        .default(5)
        .notNull(),

    image_url: varchar('image_url'),
    image_key: varchar('image_key'),
})

export const productVariantsRelations = relations(
    productVariants,
    ({ one, many }) => ({
        product: one(products, {
            fields: [productVariants.product_id],
            references: [products.id],
        }),
        variantAttributes: many(variantAttributeValues),
    })
)
