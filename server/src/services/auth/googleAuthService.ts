import { AuthProvider } from '@marriage/shared';
import { ConflictError } from '../../errors/ConflictError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import type { UserDocument } from '../../models/User';
import { createGoogleVerifier } from '../../providers/google/createGoogleVerifier';
import {
  createGoogleUser,
  findUserByEmail,
  findUserByGoogleId,
} from '../../repositories/userRepository';

async function resolveGoogleUser(profile: {
  googleId: string;
  email: string;
  name: string;
}): Promise<UserDocument> {
  const byGoogle = await findUserByGoogleId(profile.googleId);
  if (byGoogle) return byGoogle;

  const byEmail = await findUserByEmail(profile.email);
  if (byEmail) {
    if (byEmail.authProvider !== AuthProvider.GOOGLE) {
      throw new ConflictError(
        'Email already registered with password login',
        'EMAIL_PROVIDER_CONFLICT',
      );
    }
    return byEmail;
  }

  return createGoogleUser({
    name: profile.name,
    email: profile.email,
    googleId: profile.googleId,
  });
}

export async function loginWithGoogle(idToken: string): Promise<UserDocument> {
  const verifier = createGoogleVerifier();
  const profile = await verifier.verifyIdToken(idToken);

  if (!profile.emailVerified) {
    throw new UnauthorizedError('Google email not verified', 'GOOGLE_EMAIL_UNVERIFIED');
  }

  return resolveGoogleUser(profile);
}
