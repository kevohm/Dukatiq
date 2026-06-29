import request from 'supertest'
import { describe, it, expect } from 'vitest'

import { sequelize } from '../../../src/config/database.js'
import { createApp } from '../../../src/index.js'
import { StatusCodes } from 'http-status-codes'

let app = createApp()

describe('Expense API', () => {
    describe('POST /api/expense ', () => {
        it('should create expense', async () => {
            const res = await request(app).post('/api/expense').send({
                name: 'Lunch',
                amount: 200,
                category: 'Food',
            })
            // console.log(res.body, res.error)
            expect(res.status).toBe(201) // depends on your service
            expect(res.body.success).toBe(true)
            expect(res.body.data.name).toBe('Lunch')
        })
    })
    describe('GET /api/expense ', () => {
        it('should return all expenses', async () => {
            const res = await request(app).get('/api/expense')

            expect(res.status).toBe(200)
            expect(res.body.success).toBe(true)
            expect(Array.isArray(res.body.data)).toBe(true)
        })
    })

    describe('GET /api/expense/:id ', () => {
        it('should return one expense', async () => {
            const create = await request(app).post('/api/expense').send({
                name: 'Taxi',
                amount: 300,
                category: 'Transport',
            })

            const id = create.body.data.id

            const res = await request(app).get(`/api/expense/${id}`)

            expect(res.status).toBe(200)
            expect(res.body.data.id).toBe(id)
        })
    })

    describe('PUT /api/expense/:id ', () => {
        it('should update expense', async () => {
            const create = await request(app).post('/api/expense').send({
                name: 'Coffee',
                amount: 100,
                category: 'Food',
            })

            const id = create.body.data.id

            const res = await request(app)
                .put(`/api/expense/${id}`)
                .send({ amount: 500 })

            expect(res.status).toBe(StatusCodes.NO_CONTENT)
        })
    })

    describe('DELETE /api/expense/:id ', () => {
        it('should delete expense', async () => {
            const create = await request(app).post('/api/expense').send({
                name: 'Temp',
                amount: 50,
                category: 'Misc',
            })

            const id = create.body.data.id

            const res = await request(app).delete(`/api/expense/${id}`)

            expect(res.status).toBe(StatusCodes.NO_CONTENT)

            const check = await request(app).get(`/api/expense/${id}`)
            
            expect(check.body.success).toBe(false)
            expect(check.status).toBe(StatusCodes.NOT_FOUND)
        })
    })
})
