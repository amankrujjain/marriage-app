import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import apiRouter from './routes';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '8mb' }));
  app.use(requestLogger);
  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', env.CLIENT_URL);
      next();
    },
    express.static(path.resolve(process.cwd(), 'uploads')),
  );
  app.use('/api', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
