import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env';
import { getRedisClient } from './config/redis';
import apiRouter from './routes';
import { csrfOriginCheck } from './middleware/csrfOriginCheck';
import { generalRateLimit } from './middleware/rateLimiters';
import { requestLogger } from './middleware/requestLogger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { razorpayWebhookController } from './controllers/billing/webhookController';

export function createApp() {
  const app = express();

  // Warm Redis connection for rate limits when configured.
  getRedisClient();

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

  // Razorpay webhooks need the raw body for signature verification.
  app.post(
    '/api/v1/billing/webhooks/razorpay',
    express.raw({ type: 'application/json', limit: '1mb' }),
    (req, res, next) => {
      void razorpayWebhookController(req, res, next);
    },
  );

  app.use(express.json({ limit: '8mb' }));
  app.use(requestLogger);
  app.use('/api', csrfOriginCheck, generalRateLimit, apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
