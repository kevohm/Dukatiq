import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { errorHandler } from './middleware/error.middleware.js'
import { config, serverConfig } from './config/env.config.js'
import { appRouter } from './routes/index.js'
import { httpLogger } from './middleware/logger.middleware.js'
import { logger } from './config/logger.config.js'
import cookieParser from 'cookie-parser'



export const createApp = () => {
    // Create app
    const app = express()

    app.use(cookieParser(config.cookie.secret))

    // ─────────────────────
    // Middleware
    // ─────────────────────
    // if(config.env.isDev || config.env.isProd){
    //     app.use(httpLogger)
    // }
    app.use(helmet())
    app.use(compression())
    app.use(cors(config.cors))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // ─────────────────────
    // Routes
    // ─────────────────────
    app.use('/api', appRouter)

    // Health check (use logger if needed)
    app.get('/api/health', (req, res) => {
        // logger.info('Health check called')
        res.json({
            app:config.server.name,
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        })
    })

    // 404
    app.use((req, res) => {
        logger.warn({ path: req.path }, 'Route not found')

        res.status(404).json({
            success: false,
            app: config.server.app,
            message: 'Route not found',
        })
    })

    // Error handler
    app.use((err, req, res, next) => {
        logger.error(
            {
                err,
                path: req.path,
                method: req.method,
            },
            'Unhandled error'
        )

        errorHandler(err, req, res, next)
    })

    return app
}
