import { z } from 'zod'
import { paginationSchema } from '../base.validator.js'

export class InventoryValidator {
    // 🔹 Shared base schema (strict + consistent)
    static baseSchema = z.object({
        product_id: z.string().uuid(),
        unit_id: z.string().uuid(),

        // always POSITIVE input
        quantity: z.number().positive(),

        reference_type: z.string().optional(),
        reference_id: z.string().uuid().optional(),
    })

    // 🔹 Stock in / out share same shape
    static createSchema = this.baseSchema

    // 🔹 Adjustment (must be explicit about direction)
    static adjustSchema = z.object({
        product_id: z.string().uuid(),
        unit_id: z.string().uuid(),

        // still positive (DO NOT allow negative input)
        quantity: z.number().positive(),

        // explicit direction instead of negative numbers
        adjustment_type: z.enum(['increase', 'decrease']),

        reference_type: z.string().optional(),
        reference_id: z.string().uuid().optional(),
    })

    // 🔹 Filters for queries
    static filterSchema = paginationSchema.extend({
        product_id: z.string().uuid().optional(),
        type: z.enum(['stock_in', 'stock_out', 'adjustment']).optional(),
        sort_by: z.enum(['createdAt']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}
