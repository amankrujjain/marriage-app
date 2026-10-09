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
    const { error, value } = registerFormSchema.validate(
      { name, email, password, phone },
      { abortEarly: false },
    );
    if (error) {
      setErrors(mapJoiErrors(error));
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
    <form className="flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
      <AuthField label="Full name" name="name" value={name} onChange={setName}
        autoComplete="name" error={errors.name} />
      <AuthField label="Email" name="email" type="email" value={email}
        onChange={setEmail} autoComplete="email" error={errors.email} />
      <AuthField label="Password" name="password" type="password" value={password}
        onChange={setPassword} autoComplete="new-password" error={errors.password} />
      <AuthField label="Phone (optional)" name="phone" value={phone}
        onChange={setPhone} autoComplete="tel" error={errors.phone} />
      {authError ? <p className="text-sm text-maroon">{authError}</p> : null}
      <AuthSubmitButton label="Create account" loading={status === 'loading'} />
      <GoogleSignInButton />
      <p className="text-center font-body text-sm text-ink/70">
        Already have an account?{' '}
        <Link href="/login" className="text-maroon underline decoration-gold underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
