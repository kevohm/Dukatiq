import { z } from 'zod'
import { paginationSchema } from '../../../../base.validator.js'

export class AttributeValueValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        attribute_id: z.uuid(),
        value: z.string().min(1, 'Name is required').toLowerCase(),
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
