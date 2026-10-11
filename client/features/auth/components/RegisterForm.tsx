'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerFormSchema } from '../validators/registerFormSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAppSelector } from '@/store/hooks';
import { mapJoiErrors } from '../utils/mapJoiErrors';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';
import { GoogleSignInButton } from './GoogleSignInButton';

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuthActions();
  const status = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const digits = phone.replace(/\D/g, '');
    const { error, value } = registerFormSchema.validate(
      {
        name,
        email,
        password,
        phone: digits ? `+91${digits}` : '',
      },
      { abortEarly: false },
    );
    if (error) {
      setErrors(mapJoiErrors(error));
      return;
    }
    if (phone && digits.length !== 10) {
      setErrors({ phone: 'Enter a 10-digit mobile number' });
      return;
    }
    setErrors({});
    try {
      await register({
        name: value.name as string,
        email: value.email as string,
        password: value.password as string,
        ...(value.phone ? { phone: value.phone as string } : {}),
      });
      router.push('/account');
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
        label="Name"
        name="name"
        value={name}
        onChange={setName}
        autoComplete="name"
        placeholder="Your full name"
        icon="user"
        error={errors.name}
      />
      <AuthField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="you@example.com"
        icon="email"
        error={errors.email}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        icon="password"
        showStrength
        hint="Use 8 or more characters with a mix of letters and numbers."
        error={errors.password}
      />
      <AuthField
        label="Phone"
        name="phone"
        value={phone}
        onChange={setPhone}
        autoComplete="tel-national"
        placeholder="98765 43210"
        icon="phone"
        optional
        error={errors.phone}
      />
      <AuthSubmitButton label="Create account" loading={status === 'loading'} />
      <p className="terms">
        By creating an account you agree to the{' '}
        <a href="#" onClick={(e) => e.preventDefault()}>
          Terms
        </a>{' '}
        and{' '}
        <a href="#" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
        .
      </p>
      <GoogleSignInButton />
      <p className="auth-alt">
        Already have an account?{' '}
        <Link href="/login">
          <b>Sign in</b>
        </Link>
      </p>
    </form>
  );
}
