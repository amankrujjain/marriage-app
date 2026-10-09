import type { AuthTokensResponse, RegisterPayload } from '@marriage/shared';
import { ConflictError } from '../../errors/ConflictError';
import { createEmailUser, findUserByEmail } from '../../repositories/userRepository';
import { hashPassword } from '../passwordService';
import { signAccessToken } from '../tokenService';
import { toPublicUser } from '../../utils/toPublicUser';

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthTokensResponse> {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new ConflictError('Email already registered', 'EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await createEmailUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
    phone: payload.phone,
  });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
  });

  return { user: toPublicUser(user), accessToken };
}
