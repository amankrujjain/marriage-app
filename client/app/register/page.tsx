import { AuthShell } from '@/features/auth/components/AuthShell';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthShell title="Create account">
      <RegisterForm />
    </AuthShell>
  );
}
