import { doublePrecision, pgTable, unique, boolean, uuid } from "drizzle-orm/pg-core";

import { audit } from '../base.js'
import { products } from "./product.js";
import { units } from "./unit.js";
import { relations } from "drizzle-orm/_relations";

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
        // Linked to the specific variant, NOT the parent product
        // variant_id: uuid('variant_id')
        //     .notNull()
        //     .references(() => productVariants.id, {
        //         onDelete: 'cascade',
        //         onUpdate: 'cascade',
        //     }),
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


export const productUnitsRelations = relations(productUnits, ({ one }) => ({
    product: one(products, {
        fields: [productUnits.product_id],
        references: [products.id],
    }),

    // variant: one(productVariants, {
    //     fields: [productUnits.variant_id],
    //     references: [productVariants.id],
    // }),

    unit: one(units, {
        fields: [productUnits.unit_id],
        references: [units.id],
    }),
}))


