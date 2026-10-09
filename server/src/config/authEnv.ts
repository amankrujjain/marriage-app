import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  bcryptRounds: 12,
} as const;
