import { z } from 'zod'
import { paginationSchema } from '../../../../base.validator.js'

export class VariantAttributeValueValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        attribute_value_id: z.uuid(),
        variant_id: z.uuid()
    })

    // CREATE (all required except defaults)
    static createSchema = this.baseSchema

    // UPDATE (all optional but validated)
    static updateSchema = this.baseSchema.omit({ attribute_id: true }).partial()

    // FILTERS (for fetch all with query params)
    static filterSchema = paginationSchema.extend({
        value: z.string().optional(),

        sort_by: z.enum(['value']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}
