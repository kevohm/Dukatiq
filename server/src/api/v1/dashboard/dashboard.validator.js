import { z } from 'zod'
import { paginationSchema } from '../base.validator.js'

export class DashboardValidator {
    static periodSchema = z.object({
        period: z
            .enum(['today', 'yesterday', 'week', 'month', 'year'])
            .default('today'),
    })

    static limitSchema = z.object({
        limit: z.coerce.number().int().min(1).max(50).default(10),
    })

    static trendSchema = z.object({
        period: z.enum(['7d', '30d', '90d', '12m']).default('7d'),
    })

    static filterSchema = paginationSchema.extend({
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        period: z
            .enum(['today', 'yesterday', 'week', 'month', 'year', 'custom'])
            .optional(),
    })
}
