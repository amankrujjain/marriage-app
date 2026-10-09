import type { AuthTokensResponse, LoginPayload } from '@marriage/shared';
import { AuthProvider } from '@marriage/shared';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { findUserByEmail } from '../../repositories/userRepository';
import { verifyPassword } from '../passwordService';
import { signAccessToken } from '../tokenService';
import { toPublicUser } from '../../utils/toPublicUser';

export async function loginUser(payload: LoginPayload): Promise<AuthTokensResponse> {
  const user = await findUserByEmail(payload.email);
  if (!user || user.authProvider !== AuthProvider.EMAIL || !user.passwordHash) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await verifyPassword(payload.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
  });

  return { user: toPublicUser(user), accessToken };
}
