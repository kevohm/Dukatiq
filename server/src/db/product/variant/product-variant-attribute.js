import {
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";

import { audit } from "../base.js";
import { productVariants } from "./product-variant.js";
import { attributeValues } from "./attribute-value.js";

export const productVariantAttributes = pgTable(
  "product_variant_attribute",
  {
    ...audit,

    product_variant_id: uuid("product_variant_id")
      .references(() => productVariants.id, {
        onDelete: "cascade",
      })
      .notNull(),

    attribute_value_id: uuid("attribute_value_id")
      .references(() => attributeValues.id)
      .notNull(),
  }
);