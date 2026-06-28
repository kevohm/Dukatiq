import request from 'supertest'
import { createApp } from '../src/index.js'
import { describe, expect, it, beforeAll } from 'vitest'

let app = createApp()

describe('GET /api/health', () => {
    beforeAll(() => {
        app = createApp()
    })

    it('should return server health status', async () => {
        const res = await request(app).get('/api/health')

        expect(res.status).toBe(200)

        expect(res.body).toHaveProperty('app')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('timestamp')
        expect(res.body).toHaveProperty('uptime')

        expect(res.body.status).toBe('OK')
    })

    it('should return valid health structure', async () => {
        const res = await request(app).get('/api/health')

        expect(res.body).toMatchObject({
            status: 'OK',
            app: expect.any(String),
            timestamp: expect.any(String),
            uptime: expect.any(Number),
        })
    })

    // it('should return system status', async () => {
    //     const res = await request(app).get('/api/status')

    //     expect(res.status).toBe(200)
    //     expect(res.body).toHaveProperty('services')
    //     expect(res.body.services).toHaveProperty('database')
    // })
})
