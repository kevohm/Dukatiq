import { z } from 'zod'

export const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, {
        message: 'Password must contain at least one letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
        message: 'Password must contain at least one special character',
    })
    .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
    })

export const loginPasswordSchema = z
    .string()
    .min(8, { message: 'Invalid credentials' })
    .regex(/[a-z]/, {
        message: 'Invalid credentials',
    })
    .regex(/[0-9]/, {
        message: 'Invalid credentials',
    })
    .regex(/[^A-Za-z0-9]/, {
        message: 'Invalid credentials',
    })
    .regex(/[A-Z]/, {
        message: 'Invalid credentials',
    })

export class AuthValidator {
    static baseSchema = z.object({
        first_name: z.string().min(1, 'First Name is required'),
        last_name: z.string().min(1, 'Last Name is required'),
        email: z.string().min(1, 'Email is required'),
        password: passwordSchema,
    })

    static signupSchema = this.baseSchema

    static loginSchema = z.object({
        email: z.string().min(1, 'Email is required'),
        password: loginPasswordSchema,
    })
}
