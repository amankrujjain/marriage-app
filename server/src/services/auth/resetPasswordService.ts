import crypto from 'crypto';
import type { ResetPasswordPayload } from '@marriage/shared';
import { BadRequestError } from '../../errors/BadRequestError';
import {
  findUserByPasswordResetTokenHash,
  updatePasswordAndClearReset,
} from '../../repositories/userRepository';
import { revokeAllRefreshTokensForUser } from '../../repositories/refreshTokenRepository';
import { hashPassword } from '../passwordService';

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function resetPasswordWithToken(
  payload: ResetPasswordPayload,
): Promise<void> {
  const tokenHash = hashToken(payload.token.trim());
  const user = await findUserByPasswordResetTokenHash(tokenHash);
  if (!user) {
    throw new BadRequestError(
      'This reset link is invalid or has expired. Request a new one.',
      'RESET_TOKEN_INVALID',
    );
  }

  const passwordHash = await hashPassword(payload.password);
  await updatePasswordAndClearReset(String(user._id), passwordHash);
  await revokeAllRefreshTokensForUser(user._id);
}
