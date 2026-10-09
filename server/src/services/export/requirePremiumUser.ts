import { PaymentError } from '../../errors/PaymentError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { findUserById } from '../../repositories/userRepository';
import { isPremium } from '../../utils/isPremium';
import type { UserDocument } from '../../models/User';

export async function requirePremiumUser(userId: string): Promise<UserDocument> {
  const user = await findUserById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found', 'USER_NOT_FOUND');
  }
  if (!isPremium(user.premiumUntil)) {
    throw new PaymentError(
      'Wedding Pass required to export biodata',
      'PREMIUM_REQUIRED',
    );
  }
  return user;
}
