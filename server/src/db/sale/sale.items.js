import { doublePrecision, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { audit } from '../base.js'
import { products, sales, units } from "../schema.js";


export const saleItems = pgTable('sale_item', {
    ...audit,
    quantity: integer('quantity').notNull(),
    selling_price: doublePrecision('selling_price').notNull(),
    cost_price: doublePrecision('cost_price').notNull(),
    profit: doublePrecision('profit').notNull(),
    sale_id: uuid('sale_id').references(() => sales.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    product_id: uuid('product_id').references(() => products.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    unit_id: uuid('unit_id').references(() => units.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
