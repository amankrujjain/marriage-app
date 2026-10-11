'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginFormSchema } from '../validators/loginFormSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAppSelector } from '@/store/hooks';
import { mapJoiErrors } from '../utils/mapJoiErrors';
import { safeNextPath } from '../utils/safeNextPath';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';
import { GoogleSignInButton } from './GoogleSignInButton';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthActions();
  const status = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nextPath = safeNextPath(searchParams.get('next'));

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
      router.push(nextPath);
    } catch {
      /* error shown via Redux */
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate>
      <div className={`form-alert${authError ? ' show' : ''}`} role="alert">
        {authError}
      </div>
      <AuthField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="Enter your email"
        icon="email"
        error={errors.email}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
        placeholder="Enter your password"
        icon="password"
        error={errors.password}
      />
      <div style={{ textAlign: 'right', marginTop: -6 }}>
        <Link href="/forgot-password" style={{ fontWeight: 600, fontSize: '.92rem' }}>
          Forgot password?
        </Link>
      </div>
      <AuthSubmitButton label="Sign in" loading={status === 'loading'} />
      <GoogleSignInButton />
      <p className="auth-alt">
        New to Vivah Patra?{' '}
        <Link href="/register">
          <b>Create account</b>
        </Link>
      </p>
    </form>
  );
}
