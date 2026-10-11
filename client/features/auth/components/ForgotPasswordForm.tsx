'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email like name@example.com');
      return;
    }
    setError('');
    setLoading(true);
    // No reset-password API in this build — show confirmation UI only.
    await new Promise((r) => setTimeout(r, 450));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div>
        <div className="form-ok show" role="status">
          If an account exists for {email.trim()}, you will receive reset instructions shortly.
          Password email is not connected in this build yet.
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
      <AuthField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        placeholder="Enter your email"
        icon="email"
        error={error}
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
