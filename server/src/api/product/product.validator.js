import { z } from 'zod'
import { paginationSchema } from '../base.validator.js'
import { ProductUnitValidator } from './product-unit/product.unit.validator.js'
import { UnitValidator } from './unit/unit.validator.js'

export class ProductValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        name: z.string().min(1, 'Name is required').toLowerCase(),

        category: z
            .string({ error: 'Category is required' })
            .min(1, 'Category is required')
            .toLowerCase(),
        brand: z
            .string({ error: 'Brand is required' })
            .min(1, 'Brand is required')
            .toLowerCase(),
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
        units: z
            .array(
                z.object({
                    conversion_factor: z.number({
                        error: 'Conversion factor is required',
                    }),
                    is_base_unit: z.boolean().default(false),
                    unit_name: z
                        .string()
                        .min(1, 'Unit name is required')
                        .toLowerCase(),
                }),
                {
                    error: 'Please provide at least one unit',
                }
            )
            .min(1, 'Please provide at least one unit')
            .refine((units) => units.some((unit) => unit.is_base_unit), {
                message: 'One unit must be marked as the base unit',
            })
            .refine(
                (units) =>
                    units.filter((unit) => unit.is_base_unit).length === 1,
                {
                    message: 'Only one base unit is allowed',
                }
            ),
    })

    // CREATE (all required except defaults)
    static createSchema = this.baseSchema

    // UPDATE (all optional but validated)
    static updateSchema = this.baseSchema.partial()

    // FILTERS (for fetch all with query params)
    static filterSchema = paginationSchema.extend({
        name: z.string().optional(),
        category: z.string().optional(),

        min_price: z.number().optional(),
        max_price: z.number().optional(),

        in_stock: z.boolean().optional(),

        low_stock: z.boolean().optional(), // stock <= min_stock

        sort_by: z.enum(['name', 'selling_price', 'stock']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}
