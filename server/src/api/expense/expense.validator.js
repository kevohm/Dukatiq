import { z } from "zod";
import {paginationSchema} from "../base.validator.js"

export  class ExpenseValidator {
    static baseSchema = z.object({
        name: z.string().min(1, 'Expense name is required'),
        amount: z.number({ error: 'Expense amount is required' }),
    })

    static createSchema = this.baseSchema

    static updateSchema = this.baseSchema.partial()

    static filterSchema = paginationSchema.extend({
        name: z.string().optional(),
        sort_by: z.enum(['name', 'amount']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}