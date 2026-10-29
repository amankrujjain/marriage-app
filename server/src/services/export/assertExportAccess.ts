import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { findUserById } from '../../repositories/userRepository';
import { isPremium } from '../../utils/isPremium';
import { findActiveDesignTierBySlug } from '../designs/designTemplateService';
import { requirePremiumUser } from './requirePremiumUser';

/** Shared Free/Premium design gate + whether the user has an active Wedding Pass. */
export async function assertExportAccess(input: {
  userId: string;
  designSlug?: string;
}): Promise<{ hasPass: boolean }> {
  const slug = input.designSlug?.trim();
  const tier = slug ? await findActiveDesignTierBySlug(slug) : null;

  if (tier !== 'Free') {
    await requirePremiumUser(input.userId);
    return { hasPass: true };
  }

  const user = await findUserById(input.userId);
  if (!user) {
    throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
  }
  return { hasPass: isPremium(user.premiumUntil) };
}
