import {
  pgTable,
  uuid,
} from "drizzle-orm/pg-core";

import { audit } from "../base.js";

import { productUnits } from "./product-unit.js";
import { attributeValues } from "./attribute-value.js";

export const productUnitAttributes = pgTable(
  "product_unit_attribute",
  {
    ...audit,

    product_unit_id: uuid("product_unit_id")
      .references(() => productUnits.id, {
        onDelete: "cascade",
      })
      .notNull(),

    attribute_value_id: uuid("attribute_value_id")
      .references(() => attributeValues.id)
      .notNull(),
  }
);