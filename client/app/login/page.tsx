import { AuthShell } from '@/features/auth/components/AuthShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell title="Sign in">
      <LoginForm />
    </AuthShell>
  );
}
