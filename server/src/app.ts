import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env';
import apiRouter from './routes';
import { csrfOriginCheck } from './middleware/csrfOriginCheck';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Correct client IPs behind reverse proxies (rate limits, logs).
  if (env.NODE_ENV === 'production' || process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
  }

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
  app.use(cookieParser());
  app.use(express.json({ limit: '8mb' }));
  app.use(requestLogger);
  // Files are private: served only via /api/v1/media with auth or signed URL.
  app.use('/api', csrfOriginCheck, apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
