import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { errorHandler } from './middleware/error.middleware.js';
import { config, serverConfig } from './config/env.config.js';
import { appRouter } from './routes/index.js';
import { httpLogger } from './middleware/logger.middleware.js';
import { logger } from './config/logger.config.js';
import {sequelize} from './config/database.js';
import cookieParser from "cookie-parser";



// App identity
const APP_NAME = 'Dukatiq';



// Create app
export const app = express();

app.use(cookieParser(config.cookie.secret))

app.locals.name = APP_NAME;

// Request ID / headers
app.use((req, res, next) => {
  res.setHeader('X-App-Name', APP_NAME);
  next();
});

const PORT = config.server.port;

// ─────────────────────
// Middleware
// ─────────────────────
app.use(httpLogger);
app.use(helmet());
app.use(compression());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ─────────────────────
// Routes
// ─────────────────────
app.use('/api', appRouter);

// Health check (use logger if needed)
app.get('/api/health', (req, res) => {
  logger.info('Health check called');

  res.json({
    app: APP_NAME,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404
app.use((req, res) => {
  logger.warn({ path: req.path }, 'Route not found');

  res.status(404).json({
    success: false,
    app: APP_NAME,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
    },
    'Unhandled error'
  );

  errorHandler(err, req, res, next);
});


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