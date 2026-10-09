import type { PublicUser } from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import { findUserById } from '../../repositories/userRepository';
import { toPublicUser } from '../../utils/toPublicUser';

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found', 'USER_NOT_FOUND');
  }
  return toPublicUser(user);
}
