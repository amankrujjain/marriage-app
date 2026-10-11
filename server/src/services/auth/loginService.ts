import type { LoginPayload } from '@marriage/shared';
import { AuthProvider } from '@marriage/shared';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import type { UserDocument } from '../../models/User';
import { findUserByEmail } from '../../repositories/userRepository';
import { verifyPassword } from '../passwordService';

export async function loginUser(payload: LoginPayload): Promise<UserDocument> {
  const user = await findUserByEmail(payload.email);
  if (!user || user.authProvider !== AuthProvider.EMAIL || !user.passwordHash) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await verifyPassword(payload.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  return user;
}
