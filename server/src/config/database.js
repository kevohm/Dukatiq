// @ts-check
import { Sequelize, QueryTypes, DataTypes } from 'sequelize'
import { config } from './env.config.js'
import { logger } from './logger.config.js'

if (!config.env.isProd) {
    logger.debug(
        `Running DB: ${config.env.isTest ? 'TEST (memory)' : 'DEV (file)'}`
    )
}
/** @type {Sequelize} */
const sequelize = new Sequelize({
    dialect: 'sqlite',

    // 🔑 Switch DB based on environment
    storage: config.env.isTest ? ':memory:' : config.db.path,

    logging: config.env.isTest ? false : (msg) => logger.debug(msg),

    define: {
        freezeTableName: true,
        timestamps: true,
    },
})

export { sequelize, DataTypes, QueryTypes }
