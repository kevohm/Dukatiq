import { doublePrecision, pgTable, unique, boolean, uuid } from "drizzle-orm/pg-core";

import { audit } from '../base.js'
import { products } from "./product.js";
import { units } from "./unit.js";

export const productUnits = pgTable(
    'product_unit',
    {
        ...audit,
        conversion_factor: doublePrecision('conversion_factor').notNull(),
        is_base_unit: boolean('is_base_unit').default(false).notNull(),
        product_id: uuid('product_id')
            .notNull()
            .references(() => products.id, {
                onDelete: 'cascade',
                onUpdate: 'cascade',
            }),
        unit_id: uuid('unit_id')
            .notNull()
            .references(() => units.id, {
                onDelete: 'restrict',
                onUpdate: 'cascade',
            }),
    },
    (table) => [
        unique('product_unit_product_unit_unique').on(
            table.product_id,
            table.unit_id
        ),
    ]
)
