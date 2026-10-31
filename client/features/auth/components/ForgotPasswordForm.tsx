'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ApiClientError } from '@/lib/apiClient';
import { forgotPasswordRequest } from '../services/authApi';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError('Enter your email');
      setFormError('');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError('Enter a valid email like name@example.com');
      setFormError('');
      return;
    }
    setFieldError('');
    setFormError('');
    setLoading(true);
    try {
      await forgotPasswordRequest({ email: trimmed });
      setSent(true);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : 'Could not send the reset email. Please try again.';
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div>
        <div className="form-ok show" role="status">
          If an account exists for {email.trim()}, you will receive reset
          instructions shortly. Check your inbox and spam folder.
        </div>
        <p className="auth-alt" style={{ marginTop: 18 }}>
          <Link href="/login">
            <b>← Back to sign in</b>
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
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="Enter your email"
        icon="email"
        error={fieldError}
      />
      <AuthSubmitButton label="Send reset link" loading={loading} />
      <p className="auth-alt">
        Remembered it?{' '}
        <Link href="/login">
          <b>Sign in</b>
        </Link>
      </p>
    </form>
  );
}
