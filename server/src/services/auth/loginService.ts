import type { LoginPayload } from '@marriage/shared';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import type { UserDocument } from '../../models/User';
import { findUserByEmail } from '../../repositories/userRepository';
import { verifyPassword } from '../passwordService';

export async function loginUser(payload: LoginPayload): Promise<UserDocument> {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (!user.passwordHash) {
    throw new UnauthorizedError(
      'This email is registered with Google. Continue with Google, or use Forgot password to set a login password.',
      'USE_GOOGLE_SIGN_IN',
    );
  }

  const valid = await verifyPassword(payload.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  return user;
}
