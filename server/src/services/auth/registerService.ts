import type { RegisterPayload } from '@marriage/shared';
import { ConflictError } from '../../errors/ConflictError';
import type { UserDocument } from '../../models/User';
import { createEmailUser, findUserByEmail } from '../../repositories/userRepository';
import { hashPassword } from '../passwordService';

export async function registerUser(payload: RegisterPayload): Promise<UserDocument> {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new ConflictError('Email already registered', 'EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(payload.password);
  return createEmailUser({
    name: payload.name,
    email: payload.email,
    passwordHash,
    phone: payload.phone,
  });
}
