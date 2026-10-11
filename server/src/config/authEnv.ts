import { env } from './env';

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  /** Short-lived access JWT (cookie). */
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  /** Long-lived refresh JWT (cookie + DB). */
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  /** @deprecated use accessExpiresIn — kept for any leftover refs */
  jwtExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? process.env.JWT_EXPIRES_IN ?? '15m',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  bcryptRounds: 12,
  cookies: {
    accessName: 'vivah_at',
    refreshName: 'vivah_rt',
  },
} as const;
