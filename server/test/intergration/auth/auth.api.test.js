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
    logout: basePath + "/logout"
}

describe('Auth API', () => {
    beforeAll(() => {
        app = createApp()
    })

    describe('POST /api/auth/signup', () => {
        it('should create user', async () => {
            const payload = createPayload()

            const res = await request(app).post(paths.signup).send(payload)

            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toBeDefined()
            expect(res.body.data.email).toBe(payload.email)

            // ensure password is not leaked
            expect(res.body.data.password).toBeUndefined()
        })

        it('should reject duplicate email', async () => {
            const payload = createPayload()

            await request(app).post(paths.signup).send(payload)
            const res = await request(app).post(paths.signup).send(payload)

            expect(res.status).toBe(400) // from your controller catch block
            expect(res.body.message).toBeDefined()
        })
    })
    describe('POST /api/auth/login', () => {
        it('should login and set cookies', async () => {
            const payload = createPayload()

            await request(app).post(paths.signup).send(payload)

            const res = await request(app).post(paths.login).send({
                email: payload.email,
                password: payload.password,
            })

            // console.log(res.body,res.error)

            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
            // expect(res.body.data.accessToken).toBeDefined()
            // cookies should be set
            const cookies = res.headers['set-cookie']
            expect(cookies).toBeDefined()
        })
        it('should fail with invalid credentials', async () => {
            const res = await request(app).post(paths.login).send({
                email: 'wrong@test.com',
                password: 'wrong',
            })

            expect(res.status).toBe(401)
            expect(res.body.message).toBeDefined()
        })
    })

    describe('GET /api/auth/me', () => {
        it('should return current user', async () => {
            const payload = createPayload()

            await request(app).post(paths.signup).send(payload)

            const loginRes = await request(app).post(paths.login).send({
                email: payload.email,
                password: payload.password,
            })

            const cookies = loginRes.headers['set-cookie']

            const res = await request(app).get(paths.me).set('Cookie', cookies)

            expect(res.status).toBe(200)
            expect(res.body.data).toBeDefined()
            expect(res.body.data.email).toBe(payload.email)
        })
    })
    describe('POST /api/auth/refresh', () => {
        it('should refresh tokens', async () => {
            const payload = createPayload()

            await request(app).post(paths.signup).send(payload)

            const loginRes = await request(app).post(paths.login).send({
                email: payload.email,
                password: payload.password,
            })

            const cookies = loginRes.headers['set-cookie']
            expect(cookies).toBeDefined() // important

            const res = await request(app)
                .post(paths.refresh)
                .set('Cookie', cookies)

            expect(res.status).toBe(200)
            expect(res.body.success).toBeDefined()

            const newCookies = res.headers['set-cookie']
            expect(newCookies).toBeDefined()
        })
    })

    describe('POST /api/auth/logout', () => {
        it('should clear cookies', async () => {
            const payload = createPayload()

            await request(app).post(paths.signup).send(payload)

            const loginRes = await request(app).post(paths.login).send({
                email: payload.email,
                password: payload.password,
            })

            const cookies = loginRes.headers['set-cookie']

            const res = await request(app)
                .post(paths.logout)
                .set('Cookie', cookies)

            expect(res.status).toBe(204)
        })
    })
})
