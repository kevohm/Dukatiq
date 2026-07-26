import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { audit } from "../base.js";
import { attributes } from "./attribute.js";

export const attributeValues = pgTable("attribute_value", {
  ...audit,

  attribute_id: uuid("attribute_id")
    .references(() => attributes.id, { onDelete: "cascade" })
    .notNull(),

  value: varchar("value", { length: 100 }).notNull(),
});