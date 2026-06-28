
import { sequelize } from './config/database.js';
import { config } from './config/env.config.js';
import { logger } from './config/logger.config.js';
import { createApp } from './index.js';


const app =  createApp()
const PORT = config.server.port
const APP_NAME = config.server.name

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync()
     logger.info("connected to db")
        logger.info({
          api: `http://localhost:${PORT}/api`
        }, `${APP_NAME} started successfully`);
  } catch (error) {
    logger.error(error?.message ?? "Error starting app")
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info(`Shutting down ${APP_NAME}`);
  process.exit(0);
});