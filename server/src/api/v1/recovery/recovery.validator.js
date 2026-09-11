import z from 'zod'

export class RecoveryValidator {
    static baseSchema = z.object({
        user_id: z.string("User required"),
        questions: z
            .array(
                z.object({
                    question: z.string().min(1),
                    answer: z.string().min(1).trim().toLowerCase(),
                    code: z.string().min(1),
                })
            )
            .min(2, 'Add at least two recovery questions')
            .refine(
                (items) =>
                    new Set(items.map((i) => i.question)).size === items.length,
                {
                    message: 'Recovery questions must be unique',
                }
            ),
    })

    static recoverySchema = this.baseSchema
}
