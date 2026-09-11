import { doublePrecision, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'
import { products, units } from "../schema.js";


export const inventory = pgTable('inventory', {
    ...audit,
    type: varchar('type').notNull(),
    quantity: doublePrecision('quantity').notNull(),
    normalized_quantity: doublePrecision('normalized_quantity').notNull(),
    adjustment_type: varchar('adjustment_type'),
    reference_type: varchar('reference_type'),
    reference_id: uuid('reference_id'),
    product_id: uuid('product_id').references(() => products.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    unit_id: uuid('unit_id').references(() => units.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
