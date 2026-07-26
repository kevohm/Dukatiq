import {
  integer,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { audit } from "../base.js";
import { products } from "./product.js";

export const productVariants = pgTable("product_variant", {
  ...audit,

  product_id: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  sku: varchar("sku", { length: 100 }),

  buying_price: numeric("buying_price", {
    precision: 12,
    scale: 2,
  }),

  selling_price: numeric("selling_price", {
    precision: 12,
    scale: 2,
  }),

  quantity: integer("quantity").default(0).notNull(),
});