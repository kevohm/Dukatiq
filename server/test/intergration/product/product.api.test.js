import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { createApp } from '../../../src/index.js'
import { StatusCodes } from 'http-status-codes'

import { productFactory } from '../../utils/factory.js'

const app = createApp()

describe('Product API', () => {
    describe('POST /api/products', () => {
        it('should create product', async () => {
            const payload = productFactory({ category: 'Food' })

            const res = await request(app).post('/api/products').send(payload)

            expect(res.status).toBe(StatusCodes.CREATED)
            expect(res.body.success).toBe(true)
            expect(res.body.data.name).toBe(payload.name)
            expect(res.body.data.category_id).toBeDefined()
        })
    })

    describe('GET /api/products', () => {
        it('should return all products', async () => {
            await request(app)
                .post('/api/products')
                .send(productFactory({ category: 'Drinks' }))

            const res = await request(app).get('/api/products')

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.success).toBe(true)
            expect(Array.isArray(res.body.data)).toBe(true)
        })
    })

    describe('GET /api/products/:id', () => {
        it('should return one product', async () => {
            const create = await request(app)
                .post('/api/products')
                .send(productFactory({ category: 'Drinks' }))

            const id = create.body.data.id

            const res = await request(app).get(`/api/products/${id}`)

            expect(res.status).toBe(StatusCodes.OK)
            expect(res.body.success).toBe(true)
            expect(res.body.data.id).toBe(id)
        })
    })

    describe('PUT /api/products/:id', () => {
        it('should update product', async () => {
            const create = await request(app)
                .post('/api/products')
                .send(productFactory({ category: 'Drinks' }))

            const id = create.body.data.id

            const res = await request(app).put(`/api/products/${id}`).send({
                name: 'Updated Product Name',
                selling_price: 999,
            })

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })
    })

    describe('DELETE /api/products/:id', () => {
        it('should delete product', async () => {
            const create = await request(app)
                .post('/api/products')
                .send(productFactory({ category: 'Misc' }))

            const id = create.body.data.id

            const res = await request(app).delete(`/api/products/${id}`)

            expect(res.status).toBe(StatusCodes.NO_CONTENT)

            const check = await request(app).get(`/api/products/${id}`)

            expect(check.status).toBe(StatusCodes.NOT_FOUND)
            expect(check.body.success).toBe(false)
        })
    })
})
