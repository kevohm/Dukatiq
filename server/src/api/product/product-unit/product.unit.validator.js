import { z } from 'zod'
import { paginationSchema } from '../../base.validator.js'

export class ProductUnitValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        product_id: z.uuid({ error: 'Product required' }),
        unit_id: z.uuid({ error: 'Unit required' }),
        conversion_factor: z.number({ error: 'conversion factor is required' }),
        is_base_unit: z.boolean().optional(),
    })
    static productSchema = this.baseSchema.pick({ product_id: true })
    static productAndUnitSchema = this.baseSchema.pick({ product_id: true, unit_id:true })
    // CREATE (all required except defaults)
    static createSchema = this.baseSchema

    // UPDATE (all optional but validated)
    static updateSchema = this.baseSchema.omit({product_id:true,unit_id:true}).partial()

    // FILTERS (for fetch all with query params)
    static filterSchema = paginationSchema.extend({
        name: z.string().optional(),
        sort_by: z.enum(['is_base_unit', 'conversion_factor']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}
