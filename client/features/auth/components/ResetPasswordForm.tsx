'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PASSWORD_HINT } from '@marriage/shared';
import { ApiClientError } from '@/lib/apiClient';
import { mapJoiErrors } from '../utils/mapJoiErrors';
import { resetPasswordFormSchema } from '../validators/resetPasswordFormSchema';
import { resetPasswordRequest } from '../services/authApi';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const { error, value } = resetPasswordFormSchema.validate(
      { password, confirm },
      { abortEarly: false },
    );
    if (error) {
      setErrors(mapJoiErrors(error));
      setFormError('');
      return;
    }
    setErrors({});
    setFormError('');
    setLoading(true);
    try {
      await resetPasswordRequest({ token, password: value.password });
      setDone(true);
      window.setTimeout(() => router.push('/login/'), 1600);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Could not update the password. Please try again.';
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <div className="form-alert show" role="alert">
          This reset link is missing or incomplete. Request a new one from the
          forgot password page.
        </div>
        <p className="auth-alt" style={{ marginTop: 18 }}>
          <Link href="/forgot-password">
            <b>Request a new link</b>
          </Link>
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div className="form-ok show" role="status">
          Password updated. Taking you to sign in…
        </div>
        <p className="auth-alt" style={{ marginTop: 18 }}>
          <Link href="/login">
            <b>Sign in now</b>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate>
      <div className={`form-alert${formError ? ' show' : ''}`} role="alert">
        {formError}
      </div>
      <AuthField
        label="New password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        icon="password"
        showStrength
        hint={PASSWORD_HINT}
        error={errors.password}
      />
      <AuthField
        label="Confirm password"
        name="confirm"
        type="password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        placeholder="Type it again"
        icon="password"
        error={errors.confirm}
      />
      <AuthSubmitButton label="Update password" loading={loading} />
      <p className="auth-alt">
        <Link href="/login">
          <b>← Back to sign in</b>
        </Link>
      </p>
    </form>
  );
}
