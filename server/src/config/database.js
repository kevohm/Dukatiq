// @ts-check

import 'reflect-metadata'
import path from 'node:path'
import { DataSource } from 'typeorm'
import { config } from './env.config.js'
import { logger } from './logger.config.js'

if (!config.env.isProd) {
    logger.debug(
        `Running DB: ${config.env.isTest ? 'TEST (memory)' : 'DEV (file)'}`
    )
}

export const db = new DataSource({
    type: 'better-sqlite3',

    database: config.env.isTest ? ':memory:' : config.db.path,

    synchronize: true,

    logging: !config.env.isTest,

    entitySkipConstructor: true,

    entities: [path.resolve('src/entities/**/*.js')],

    migrations: [path.resolve('src/migrations/**/*.js')],
})
