import type { PublicUser } from '@marriage/shared';
import type { UserDocument } from '../models/User';
import { isPremium } from './isPremium';

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    authProvider: user.authProvider,
    role: user.role,
    premiumUntil: user.premiumUntil ? user.premiumUntil.toISOString() : null,
    isPremium: isPremium(user.premiumUntil),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
