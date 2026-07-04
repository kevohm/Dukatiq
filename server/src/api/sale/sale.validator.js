import { z } from 'zod'
import { paginationSchema } from '../../base.validator.js'

export class SaleValidator {
    // -----------------------------
    // SALE ITEM SCHEMA
    // -----------------------------
    static saleItemSchema = z.object({
        product_id: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be > 0'),

        // optional override (fallback to product price in service)
        selling_price: z.number().positive().optional(),
    })

    // -----------------------------
    // BASE SALE SCHEMA
    // -----------------------------
    static baseSchema = z.object({
        items: z
            .array(this.saleItemSchema)
            .min(1, 'At least one item is required'),

        payment_method: z.enum(['cash', 'mpesa', 'card', 'credit']).optional(),
    })

    // -----------------------------
    // CREATE SALE
    // -----------------------------
    static createSchema = this.baseSchema

    // -----------------------------
    // FILTER / LIST SALES
    // -----------------------------
    static filterSchema = paginationSchema.extend({
        payment_method: z.enum(['cash', 'mpesa', 'card', 'credit']).optional(),

        min_total: z.number().optional(),
        max_total: z.number().optional(),

        from_date: z.string().datetime().optional(),
        to_date: z.string().datetime().optional(),

        sort_by: z.enum(['total_amount', 'createdAt']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })

    // -----------------------------
    // SINGLE ID VALIDATION
    // -----------------------------
    static idSchema = z.object({
        id: z.string().uuid('Invalid sale ID'),
    })
}
