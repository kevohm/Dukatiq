import { z } from "zod";
import {paginationSchema} from "../base.validator.js"

export  class ProductValidator {
    // Base schema (reusable)
    static baseSchema = z.object({
        name: z.string().min(1, 'Name is required'),
        category: z.string().min(1, 'Category is required'),
        cost_price: z.number().min(0),
        selling_price: z.number().min(0),
        stock_quantity: z.number().int().min(0).default(0),
        low_stock_threshold: z.number().int().min(0).default(10),
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