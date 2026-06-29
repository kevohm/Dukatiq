import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { createApp } from '../../../../src/index.js'

const app = createApp()

describe('ProductCategory API', () => {

    describe('POST /api/product-category', () => {
        it('should create category', async () => {
            const res = await request(app).post('/api/product-category').send({
                name: 'Food',
            })

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.data.name).toBe('Food')
        })
    })

    describe('GET /api/product-category', () => {
        it('should return all categories', async () => {
            await request(app).post('/api/product-category').send({ name: 'Drinks' })

            const res = await request(app).get('/api/product-category')

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.success).toBe(true)
            expect(Array.isArray(res.body.data)).toBe(true)
        })
    })

    describe('GET /api/product-category/:id', () => {
        it('should return single category', async () => {
            const create = await request(app)
                .post('/api/product-category')
                .send({ name: 'Electronics' })

            const id = create.body.data.id

            const res = await request(app).get(`/api/product-category/${id}`)

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data.id).toBe(id)
        })
    })

    describe('PUT /api/product-category/:id', () => {
        it('should update category', async () => {
            const create = await request(app)
                .post('/api/product-category')
                .send({ name: 'Old Name' })

            const id = create.body.data.id

            const res = await request(app)
                .put(`/api/product-category/${id}`)
                .send({ name: 'New Name' })

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })
    })

    describe('DELETE /api/product-category/:id', () => {
        it('should delete category', async () => {
            const create = await request(app)
                .post('/api/product-category')
                .send({ name: 'ToDelete' })

            const id = create.body.data.id

            const res = await request(app).delete(`/api/product-category/${id}`)

            expect(res.status).toBe(StatusCodes.NO_CONTENT)

            const check = await request(app).get(`/api/product-category/${id}`)

            expect(check.status).toBe(StatusCodes.NOT_FOUND)
        })
    })
})
