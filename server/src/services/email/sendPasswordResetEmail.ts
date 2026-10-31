import { env } from '../../config/env';
import { mailConfig } from '../../config/mailEnv';
import { createEmailProvider } from '../../providers/email/createEmailProvider';
import { AppError } from '../../errors/AppError';
import { logger } from '../../utils/logger';

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  const subject = 'Reset your MarriageBio password';
  const text = [
    'You asked to reset your MarriageBio password.',
    '',
    `Open this link within 1 hour to choose a new password:`,
    resetUrl,
    '',
    'If you did not ask for this, you can ignore this email.',
    '',
    '— MarriageBio',
  ].join('\n');

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#2A1517;max-width:520px">
      <p>You asked to reset your MarriageBio password.</p>
      <p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#681421;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">
          Choose a new password
        </a>
      </p>
      <p style="color:#5B4548;font-size:14px">This link expires in 1 hour. If the button does not work, paste this into your browser:</p>
      <p style="word-break:break-all;font-size:13px;color:#5B4548">${resetUrl}</p>
      <p style="color:#5B4548;font-size:14px">If you did not ask for this, you can ignore this email.</p>
      <p style="margin-top:24px">— MarriageBio</p>
    </div>
  `.trim();

  const provider = createEmailProvider();
  if (!provider) {
    if (env.NODE_ENV === 'development') {
      logger.warn('SMTP not configured — password reset link (dev only)', {
        to,
        resetUrl,
      });
      return;
    }
    throw new AppError(
      'Email is not configured on the server',
      503,
      'EMAIL_NOT_CONFIGURED',
    );
  }

  try {
    await provider.send({ to, subject, text, html });
    logger.info('Password reset email sent', {
      to,
      from: mailConfig.from,
    });
  } catch (error) {
    logger.error('Failed to send password reset email', {
      to,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AppError(
      'Could not send the reset email. Please try again shortly.',
      502,
      'EMAIL_SEND_FAILED',
    );
  }
}
