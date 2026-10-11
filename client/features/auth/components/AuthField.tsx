'use client';

import { useState } from 'react';

type AuthFieldProps = {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
  placeholder?: string;
  icon?: 'email' | 'user' | 'password' | 'phone';
  hint?: string;
  showStrength?: boolean;
  optional?: boolean;
};

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function strength(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
  return s;
}

const STRENGTH_COLORS = ['#B3261E', '#B3261E', '#E3A21A', '#2F7A4B', '#2F7A4B'];

export function AuthField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  autoComplete,
  error,
  placeholder,
  icon,
  hint,
  showStrength,
  optional,
}: AuthFieldProps) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password' || icon === 'password';
  const isPhone = icon === 'phone';
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type;
  const s = showStrength ? strength(value) : 0;

  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {optional ? (
          <span style={{ fontWeight: 400, color: 'var(--ink-3)' }}> (optional)</span>
        ) : null}
      </label>
      <div className={`inp${isPhone ? ' pre' : ''}`}>
        {isPhone ? <span className="pre-t">+91</span> : null}
        <input
          id={name}
          className={error ? 'bad' : undefined}
          type={inputType}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={isPhone ? 'numeric' : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        {isPassword ? (
          <button
            className="ic"
            type="button"
            aria-label={showPw ? 'Hide password' : 'Show password'}
            aria-pressed={showPw}
            onClick={() => setShowPw((v) => !v)}
          >
            <EyeIcon />
          </button>
        ) : icon === 'email' ? (
          <span className="ic" style={{ pointerEvents: 'none' }}>
            <EmailIcon />
          </span>
        ) : icon === 'user' ? (
          <span className="ic" style={{ pointerEvents: 'none' }}>
            <UserIcon />
          </span>
        ) : null}
      </div>
      {showStrength ? (
        <div className="meter" aria-hidden>
          <i
            style={{
              width: value ? `${Math.max(1, s) * 25}%` : 0,
              background: STRENGTH_COLORS[s],
            }}
          />
        </div>
      ) : null}
      {hint && !error ? <span className="note">{hint}</span> : null}
      {error ? <span className="field-msg">{error}</span> : null}
    </div>
  );
}
