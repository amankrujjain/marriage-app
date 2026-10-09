export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface GoogleTokenVerifier {
  verifyIdToken(idToken: string): Promise<GoogleProfile>;
}
