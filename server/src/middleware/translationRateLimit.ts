import rateLimit from 'express-rate-limit';

export const translationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many translation requests. Try again later.',
    error: { code: 'RATE_LIMITED' },
  },
});
