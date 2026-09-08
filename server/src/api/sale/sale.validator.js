import { z } from 'zod'
import { paginationSchema } from '../base.validator.js'

export class SaleValidator {
    // -----------------------------
    // SALE ITEM SCHEMA
    // -----------------------------
    static saleItemSchema = z.object({
        product_id: z.uuid('Invalid product'),
        unit_id: z.uuid('Invalid unit'),
        quantity: z.number().int().positive('Quantity must be greater than 0'),
    })

    // -----------------------------
    // CREATE SALE
    // -----------------------------
    static createSchema = z.object({
        items: z
            .array(this.saleItemSchema)
            .min(1, 'At least one item is required'),

        payment_method: z
            .enum(['cash', 'mpesa', 'card', 'credit'])
            .default('cash'),
    })

    // -----------------------------
    // FILTER / LIST SALES
    // -----------------------------
    static filterSchema = paginationSchema
        .extend({
            payment_method: z
                .enum(['cash', 'mpesa', 'card', 'credit'])
                .optional(),

            min_total: z.number().nonnegative().optional(),
            max_total: z.number().nonnegative().optional(),

            from_date: z.string().datetime().optional(),
            to_date: z.string().datetime().optional(),

            sort_by: z.enum(['total_amount', 'createdAt']).optional(),
            order: z.enum(['asc', 'desc']).optional(),
        })
        .refine(
            (data) => {
                if (data.min_total != null && data.max_total != null) {
                    return data.min_total <= data.max_total
                }
                return true
            },
            {
                message: 'min_total cannot be greater than max_total',
                path: ['min_total'],
            }
        )

    // -----------------------------
    // SINGLE ID VALIDATION
    // -----------------------------
    static idSchema = z.object({
        id: z.string().uuid('Invalid sale ID'),
    })
}
