import { OAuth2Client } from 'google-auth-library';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import type { GoogleProfile, GoogleTokenVerifier } from './GoogleTokenVerifier';

export class GoogleTokenVerifierImpl implements GoogleTokenVerifier {
  private readonly client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  async verifyIdToken(idToken: string): Promise<GoogleProfile> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedError('Invalid Google token', 'GOOGLE_TOKEN_INVALID');
    }
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email.split('@')[0] ?? 'User',
      emailVerified: Boolean(payload.email_verified),
    };
  }
}
