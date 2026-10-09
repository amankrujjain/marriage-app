import type { AuthProvider, UserRole } from '@marriage/shared';

export interface RequestUser {
  id: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
