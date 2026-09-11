import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import path from 'path'
import { createApp } from '../../../src/index.js'
import { image } from '../../fixtures/index.js'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'

const app = createApp()
let fileKey = undefined

describe('File Controller (Integration)', ({skip}) => {
    skip("Not Testing File Upload Yet")
    // =========================
    // UPLOAD
    // =========================
    // describe('POST /api/file/upload', () => {
      
    //     it('should upload file and return signed URL', async () => {
    //         const res = await request(app)
    //             .post('/api/file/upload')
    //             .field('folder', 'test')
    //             .attach('file', image)

    //         expect(res.status).toBe(StatusCodes.CREATED)
    //         expect(res.body?.data?.key).toBeDefined()
    //         expect(res.body?.data?.url).toBeDefined()
    //         fileKey = res.body?.data?.key
    //     })

    //     it('should return 400 if no file provided', async () => {
    //         const res = await request(app).post('/api/file/upload')
    //         // console.log(res.body, res.error)
    //         expect(res.status).toBe(400)
    //         expect(res.body.message).toBe('No file provided')
    //     })
    // })

    // =========================
    // DELETE
    // =========================
    // describe('DELETE /api/file/delete', () => {
    //      skip('Not Testing File Upload Yet')
    //     it('should delete file', async () => {
    //         const res = await request(app)
    //             .delete('/api/file/delete')
    //             .send({ key: fileKey })

    //         expect(res.status).toBe(StatusCodes.NO_CONTENT)
    //     })

    //     it('should return 400 if key missing', async () => {
    //         const res = await request(app).delete('/api/file/delete').send({})

    //         expect(res.status).toBe(400)
    //         expect(res.body.message).toBe('key is required')
    //     })
    // })

    // =========================
    // GET SIGNED URL
    // =========================
    // describe('GET /api/file/url', () => {
    //     it('should return signed url', async () => {
    //         const imageRes = await request(app)
    //             .post('/api/file/upload')
    //             .field('folder', 'test')
    //             .attach('file', image)
    //         const res = await request(app)
    //             .get('/api/file/url')
    //             .query({ key: imageRes?.body?.key })
    //         // console.log(res.body, res.error)
    //         expect(res.status).toBe(200)
    //         expect(res.body?.data?.url).toBeDefined()
    //         expect(res.body?.data?.expires_in).toBeDefined()
    //     })

    //     it('should return signed url with custom expiry', async () => {
    //         const imageRes = await request(app)
    //             .post('/api/file/upload')
    //             .field('folder', 'test')
    //             .attach('file', image)
    //         const res = await request(app)
    //             .get('/api/file/url')
    //             .query({ key: imageRes?.body?.key, expiresIn: 500 })

    //         expect(res.status).toBe(200)
    //         expect(res.body?.data?.url).toBeDefined()
    //         expect(res.body?.data?.expires_in).toBe(500)
    //     })

    //     it('should return 400 if key missing', async () => {
    //         const res = await request(app).get('/api/file/url')

    //         expect(res.status).toBe(400)
    //         expect(res.body?.message).toBe('key is required')
    //     })
    // })
})
