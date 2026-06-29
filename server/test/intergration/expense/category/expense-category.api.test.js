import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import { createApp } from '../../../../src/index.js'
import { StatusCodes } from 'http-status-codes'

const BASE = '/api/expense-category'

let app = createApp()

describe('Expense Category API', () => {
    beforeAll(() => {
        app = createApp()
    })

    describe(`POST ${BASE}`, () => {
        it('should create category', async () => {
            const res = await request(app).post(BASE).send({ name: 'Food' })

            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.name).toBe('Food')
        })

        it('should reject invalid category', async () => {
            const res = await request(app).post(BASE).send({}) // no name
            expect(res.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
        })

        it('should not allow duplicate category names', async () => {
            await request(app).post(BASE).send({ name: 'Unique' })

            const res = await request(app).post(BASE).send({ name: 'Unique' })

            expect(res.status).toBeGreaterThanOrEqual(400)
        })
    })

    describe(`GET ${BASE}`, () => {
        it('should get all categories', async () => {
            await request(app).post(BASE).send({ name: 'Transport' })

            const res = await request(app).get(BASE)

            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
            expect(Array.isArray(res.body.data)).toBe(true)
        })
    })

    describe(`GET ${BASE}/:id`, () => {
        it('should get category by id', async () => {
            const create = await request(app)
                .post(BASE)
                .send({ name: 'Health' })

            const id = create.body.data.id

            const res = await request(app).get(`${BASE}/${id}`)

            expect(res.status).toBe(200)
            expect(res.body.data.id).toBe(id)
        })
    })

    describe(`UPDATE ${BASE}/:id`, () => {
        it('should update category', async () => {
            const create = await request(app)
                .post(BASE)
                .send({ name: 'Old Name' })

            const id = create.body.data.id

            const res = await request(app)
                .put(`${BASE}/${id}`)
                .send({ name: 'New Name' })

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })
    })

    describe(`DELETE ${BASE}/:id`, () => {
        it('should delete category', async () => {
            const create = await request(app)
                .post(BASE)
                .send({ name: 'To Delete' })

            const id = create.body.data.id

            const res = await request(app).delete(`${BASE}/${id}`)

            expect(res.status).toBe(StatusCodes.NO_CONTENT)

            const check = await request(app).get(`${BASE}/${id}`)
            expect(check.status).toBe(StatusCodes.NOT_FOUND)
        })
    })
})
