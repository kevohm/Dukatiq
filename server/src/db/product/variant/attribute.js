import { pgTable, varchar } from "drizzle-orm/pg-core";
import { audit } from "../base.js";

export const attributes = pgTable("attribute", {
  ...audit,

  name: varchar("name", { length: 100 }).notNull(),
});