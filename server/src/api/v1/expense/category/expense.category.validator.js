import { z } from "zod";
import { paginationSchema } from "../../base.validator.js";

export  class ExpenseCategoryValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        name: z.string().min(1, 'Name is required'),
    })

    // CREATE (all required except defaults)
    static createSchema = this.baseSchema

    // UPDATE (all optional but validated)
    static updateSchema = this.baseSchema.partial()

    // FILTERS (for fetch all with query params)
    static filterSchema = paginationSchema.extend({
        name: z.string().optional(),
        sort_by: z.enum(['name']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}