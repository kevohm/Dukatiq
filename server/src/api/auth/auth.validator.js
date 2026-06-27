import { z } from 'zod'

export class AuthValidator {
    static baseSchema = z.object({
        first_name: z.string().min(1, 'First Name is required'),
        last_name: z.string().min(1, 'Last Name is required'),
        email: z.string().min(1, 'Email is required'),
        password: z.string().min(8, 'Password is required'),
    })

    static signupSchema = this.baseSchema

    static loginSchema = this.baseSchema
        .pick({ email: true, password: true })
}
