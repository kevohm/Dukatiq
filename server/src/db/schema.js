import {
    boolean,
    doublePrecision,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core'

const id = () => uuid('id').defaultRandom().primaryKey()
const audit = {
    id: id(),
    created_at: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
}

export const users = pgTable('user', {
    ...audit,
    first_name: varchar('first_name').notNull(),
    last_name: varchar('last_name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
})
export const refreshTokens = pgTable('refresh_token', {
    ...audit,
    token_hash: varchar('token_hash').notNull().unique(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    revoked_at: timestamp('revoked_at', { withTimezone: true }),
    user_agent: varchar('user_agent'),
    ip: varchar('ip'),
    user_id: uuid('user_id').references(() => users.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
export const expenseCategories = pgTable('expense_category', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
export const expenses = pgTable('expense', {
    ...audit,
    name: varchar('name').notNull(),
    amount: doublePrecision('amount').notNull(),
    category_id: uuid('category_id').references(() => expenseCategories.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
export const brands = pgTable('product_brand', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
export const productCategories = pgTable('product_category', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
export const units = pgTable('unit', {
    ...audit,
    name: varchar('name').notNull(),
})
export const products = pgTable('product', {
    ...audit,
    name: varchar('name').notNull(),
    cost_price: doublePrecision('cost_price').notNull(),
    selling_price: doublePrecision('selling_price').notNull(),
    stock_quantity: doublePrecision('stock_quantity').default(0).notNull(),
    low_stock_threshold: doublePrecision('low_stock_threshold')
        .default(5)
        .notNull(),
    image_url: varchar('image_url'),
    image_key: varchar('image_key'),
    category_id: uuid('category_id').references(() => productCategories.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    brand_id: uuid('brand_id').references(() => brands.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
export const productUnits = pgTable('product_unit', {
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
})
export const inventory = pgTable('inventory', {
    ...audit,
    type: varchar('type').notNull(),
    quantity: doublePrecision('quantity').notNull(),
    normalized_quantity: doublePrecision('normalized_quantity').notNull(),
    adjustment_type: varchar('adjustment_type'),
    reference_type: varchar('reference_type'),
    reference_id: uuid('reference_id'),
    product_id: uuid('product_id').references(() => products.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    unit_id: uuid('unit_id').references(() => units.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
export const sales = pgTable('sale', {
    ...audit,
    total_amount: doublePrecision('total_amount').notNull(),
    total_profit: doublePrecision('total_profit').notNull(),
    payment_method: varchar('payment_method').default('cash').notNull(),
})
export const saleItems = pgTable('sale_item', {
    ...audit,
    quantity: integer('quantity').notNull(),
    selling_price: doublePrecision('selling_price').notNull(),
    cost_price: doublePrecision('cost_price').notNull(),
    profit: doublePrecision('profit').notNull(),
    sale_id: uuid('sale_id').references(() => sales.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    product_id: uuid('product_id').references(() => products.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
    unit_id: uuid('unit_id').references(() => units.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
