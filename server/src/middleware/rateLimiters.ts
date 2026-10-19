import rateLimit, { type Options } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { Request, Response, NextFunction } from 'express';
import { getRedisClient, isRedisReady } from '../config/redis';
import { env } from '../config/env';

function rateLimitMessage(message: string) {
  return {
    success: false as const,
    message,
    error: { code: 'RATE_LIMITED' },
  };
}

function redisStore(prefix: string): Options['store'] | undefined {
  const redis = getRedisClient();
  if (!redis) return undefined;
  return new RedisStore({
    prefix: `rl:${prefix}:`,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    sendCommand: (...args: string[]) =>
      redis.call(args[0]!, ...args.slice(1)) as Promise<number | string | (number | string)[]>,
  });
}

function buildLimiter(
  prefix: string,
  opts: Pick<Options, 'windowMs' | 'max'> & { message: string },
) {
  return rateLimit({
    windowMs: opts.windowMs,
    max: opts.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: rateLimitMessage(opts.message),
    store: redisStore(prefix),
  });
}

/** Fail closed on billing routes when Redis is configured but unavailable. */
export function requireRedisForBilling(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!env.REDIS_URL) {
    next();
    return;
  }
  if (!isRedisReady()) {
    res.status(503).json({
      success: false,
      message: 'Payment temporarily unavailable. Try again shortly.',
      error: { code: 'REDIS_UNAVAILABLE' },
    });
    return;
  }
  next();
}

export const generalRateLimit = buildLimiter('general', {
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many requests. Try again later.',
});

export const authRateLimit = buildLimiter('auth', {
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many auth attempts. Try again later.',
});

export const translationRateLimit = buildLimiter('translation', {
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many translation requests. Try again later.',
});

export const checkoutRateLimit = buildLimiter('checkout', {
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many checkout attempts. Try again later.',
});

export const verifyRateLimit = buildLimiter('verify', {
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many payment verification attempts. Try again later.',
});
