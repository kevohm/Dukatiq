import request, { agent } from 'supertest'
import { createApp } from '../../../src/index.js'
import { describe, expect, it, beforeAll } from 'vitest'
import { email } from 'zod'
import { StatusCodes } from 'http-status-codes'

let app = createApp()

const createPayload = (
    overrides = {
        email: undefined,
        first_name: undefined,
        last_name: undefined,
        password: undefined,
    }
) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
        email: overrides?.email || `${unique}@test.com`,
        first_name: 'Kevin',
        last_name: 'Kibet',
        password: 'Kevin123',
    }
}

const basePath = '/api/auth'
let paths = {
    login: basePath + '/login',
    signup: basePath + '/signup',
    me: basePath + '/me',
    refresh: basePath + '/refresh',
    logout: basePath + '/logout',
}

describe('Auth API Validation', () => {
    beforeAll(() => {
        app = createApp()
    })

    describe('POST /api/auth/login', () => {
        it('should provide a strong password', async () => {
            const invalidPayloads = [
                {
                    email: 'wrong@test.com',
                    password: 'wrong', // must be more than 8
                    response: 'Password must be at least 8 characters long',
                },
                {
                    email: 'wrong@test.com',
                    password: '12345678', // must have a lowercase letter
                    response: 'Password must contain at least one letter',
                },
                {
                    email: 'wrong@test.com',
                    password: 'wrongpassword', // must have a number
                    response: 'Password must contain at least one number',
                },
                {
                    email: 'wrong@test.com',
                    password: '123wrongpassword', // must have a special character
                    response:
                        'Password must contain at least one special character',
                },
                {
                    email: 'wrong@test.com',
                    password: '123wrongpassword#', // must have an uppercase letter
                    response:
                        'Password must contain at least one uppercase letter',
                },
            ]
            for (const payload of invalidPayloads) {
                const res = await request(app).post(paths.login).send({
                    email: payload.email,
                    password: payload.password,
                })
               // console.log(res.error)
                expect(res.status).toBe(422)
                expect(res.body.message).toBeDefined()
                expect(res.body.message).toEqual(payload.response)
            }
        })
    })
})
