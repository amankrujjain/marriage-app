import { authConfig } from '../../config/authEnv';
import { BadRequestError } from '../../errors/BadRequestError';
import type { GoogleTokenVerifier } from './GoogleTokenVerifier';
import { GoogleTokenVerifierImpl } from './GoogleTokenVerifierImpl';

export function createGoogleVerifier(): GoogleTokenVerifier {
  if (!authConfig.googleClientId) {
    throw new BadRequestError(
      'Google sign-in is not configured',
      'GOOGLE_NOT_CONFIGURED',
    );
  }
  return new GoogleTokenVerifierImpl(authConfig.googleClientId);
}
