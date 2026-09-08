import { pgTable, varchar } from "drizzle-orm/pg-core";

import { audit } from '../base.js'
import { productUnits } from "./product.unit.js";
import { relations } from "drizzle-orm/_relations";

export const units = pgTable('unit', {
    ...audit,
    name: varchar('name').notNull(),
})

export const unitsRelations = relations(units, ({ many }) => ({
    productUnits: many(productUnits),
}))
