import { doublePrecision, pgTable, varchar, uuid } from "drizzle-orm/pg-core"
import { audit } from '../base.js'
import { relations } from "drizzle-orm/_relations"
import { productCategories } from "./product.category.js"
import { brands } from "./product.brand.js"
import { productUnits } from "./product.unit.js"
import { units } from "./unit.js"

export const products = pgTable('product', {
    ...audit,
    name: varchar('name').notNull(),
    cost_price: doublePrecision('cost_price').notNull(),
    selling_price: doublePrecision('selling_price').notNull(),
    stock_quantity: doublePrecision('stock_quantity').default(0).notNull(),
    low_stock_threshold: doublePrecision('low_stock_threshold')
        .default(5)
        .notNull(),
    image_url: varchar('image_url'),
    image_key: varchar('image_key'),
    category_id: uuid('category_id').references(() => productCategories.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    brand_id: uuid('brand_id').references(() => brands.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(productCategories, {
        fields: [products.category_id],
        references: [productCategories.id],
    }),

    brand: one(brands, {
        fields: [products.brand_id],
        references: [brands.id],
    }),

    productUnits: many(productUnits),
}))

export const unitsRelations = relations(units, ({ many }) => ({
    productUnits: many(productUnits),
}))

export const productUnitsRelations = relations(productUnits, ({ one }) => ({
    product: one(products, {
        fields: [productUnits.product_id],
        references: [products.id],
    }),

    unit: one(units, {
        fields: [productUnits.unit_id],
        references: [units.id],
    }),
}))