import crypto from 'crypto';
import type { ForgotPasswordPayload } from '@marriage/shared';
import { env } from '../../config/env';
import { findUserByEmail, setPasswordResetToken } from '../../repositories/userRepository';
import { sendPasswordResetEmail } from '../email/sendPasswordResetEmail';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/**
 * Always succeeds from the caller's view (no email enumeration).
 * Sends mail for any existing account (email/password or Google-only).
 */
export async function requestPasswordReset(
  payload: ForgotPasswordPayload,
): Promise<void> {
  const email = payload.email.trim().toLowerCase();
  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  await setPasswordResetToken(
    String(user._id),
    hashToken(rawToken),
    new Date(Date.now() + RESET_TTL_MS),
  );

  const base = env.CLIENT_URL.replace(/\/$/, '');
  const resetUrl = `${base}/reset-password/?token=${encodeURIComponent(rawToken)}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}
