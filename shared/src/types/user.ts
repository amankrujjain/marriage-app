import type { AuthProvider } from '../enums/AuthProvider';
import type { UserRole } from '../enums/UserRole';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider: AuthProvider;
  role: UserRole;
  premiumUntil: string | null;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}
