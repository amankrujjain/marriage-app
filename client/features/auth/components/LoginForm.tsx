'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginFormSchema } from '../validators/loginFormSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAppSelector } from '@/store/hooks';
import { mapJoiErrors } from '../utils/mapJoiErrors';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';
import { GoogleSignInButton } from './GoogleSignInButton';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthActions();
  const status = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const { error, value } = loginFormSchema.validate(
      { email, password },
      { abortEarly: false },
    );
    if (error) {
      setErrors(mapJoiErrors(error));
      return;
    }
    setErrors({});
    try {
      await login(value);
      router.push('/account');
    } catch {
      /* error shown via Redux */
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
      <AuthField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        error={errors.email}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        error={errors.password}
      />
      {authError ? <p className="text-sm text-maroon">{authError}</p> : null}
      <AuthSubmitButton label="Sign in" loading={status === 'loading'} />
      <GoogleSignInButton />
      <p className="text-center font-body text-sm text-ink/70">
        New here?{' '}
        <Link
          href="/register"
          className="text-maroon underline decoration-gold underline-offset-4"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
