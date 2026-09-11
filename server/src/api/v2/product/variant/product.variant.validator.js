import { z } from 'zod'
import { paginationSchema } from '../../../base.validator.js'

export class ProductVariantValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        product_id: z.uuid(),
        sku: z
            .string({
                error: 'SKU is required',
            })
            .optional(), // e.g., "DISH-GRN-SML"
        cost_price: z
            .number({
                error: 'Cost price is required',
            })
            .min(0, 'Cost price cannot be negative'),

        selling_price: z
            .number({
                error: 'Selling price is required',
            })
            .min(0, 'Selling price cannot be negative'),

        stock_quantity: z
            .number({
                error: 'Stock quantity is required',
            })
            .int('Stock quantity must be a whole number')
            .min(0, 'Stock quantity cannot be negative')
            .default(0),

        low_stock_threshold: z
            .number({
                error: 'Low stock threshold is required',
            })
            .int('Low stock threshold must be a whole number')
            .min(0, 'Low stock threshold cannot be negative')
            .default(10),

        attributes: z
            .array(
                z.object({
                    name: z
                        .string()
                        .min(1, 'Attribute name is required')
                        .toLowerCase(),

                    value: z
                        .string()
                        .min(1, 'Attribute value is required')
                        .toLowerCase(),
                })
            )
            .default([]),
    })

    // CREATE (all required except defaults)
    static createSchema = this.baseSchema

    // UPDATE (all optional but validated)
    static updateSchema = this.baseSchema
        .omit({
            stock_quantity: true,
            product_id: true,
        })
        .partial()

    // FILTERS (for fetch all with query params)
    static filterSchema = paginationSchema.extend({
        name: z.string().optional(),

        min_price: z.number().optional(),
        max_price: z.number().optional(),

        in_stock: z.boolean().optional(),

        low_stock: z.boolean().optional(), // stock <= min_stock

        sort_by: z.enum(['name', 'selling_price', 'stock']).optional(),

        order: z.enum(['asc', 'desc']).optional(),
    })
}
