import { env } from './env';

const host = (env.SMTP_HOST ?? process.env.SMTP_HOST ?? '').trim();
const user = (env.SMTP_USER ?? process.env.SMTP_USER ?? '').trim();
const pass = (env.SMTP_PASS ?? process.env.SMTP_PASS ?? '').trim();
const fromRaw = (env.MAIL_FROM ?? process.env.MAIL_FROM ?? '').trim();
const port = env.SMTP_PORT ?? Number(process.env.SMTP_PORT ?? 465);
const secure =
  env.SMTP_SECURE ??
  (process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1'
    : port === 465);

export const mailConfig = {
  host,
  port,
  secure,
  user,
  pass,
  from: fromRaw || (user ? `MarriageBio <${user}>` : ''),
  /** True when Hostinger (or any) SMTP credentials are present. */
  configured: Boolean(host && user && pass),
} as const;
