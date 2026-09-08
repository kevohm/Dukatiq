import { pgTable, varchar } from "drizzle-orm/pg-core";
import { audit } from "../base.js";

export const brands = pgTable('product_brand', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
