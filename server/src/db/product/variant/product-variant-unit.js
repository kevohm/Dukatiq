import {
  boolean,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { audit } from "../base.js";
import { productVariants } from "./product-variant.js";
import { productUnits } from "./product-unit.js";

export const productVariantUnits = pgTable(
  "product_variant_unit",
  {
    ...audit,

    product_variant_id: uuid("product_variant_id")
      .references(() => productVariants.id, {
        onDelete: "cascade",
      })
      .notNull(),

    product_unit_id: uuid("product_unit_id")
      .references(() => productUnits.id)
      .notNull(),

    barcode: varchar("barcode", { length: 100 }),

    selling_price: numeric("selling_price", {
      precision: 12,
      scale: 2,
    }).notNull(),

    buying_price: numeric("buying_price", {
      precision: 12,
      scale: 2,
    }),

    is_default: boolean("is_default").default(false).notNull(),
  }
);