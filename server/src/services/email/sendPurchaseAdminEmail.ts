import { env } from '../../config/env';
import { mailConfig } from '../../config/mailEnv';
import { createEmailProvider } from '../../providers/email/createEmailProvider';
import { logger } from '../../utils/logger';

function formatIst(value?: Date | string | null): string {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export async function sendPurchaseAdminEmail(input: {
  user: { name: string; email: string; phone?: string | null };
  order: {
    id: string;
    planSlug: string;
    amountMinor: number;
    currency: string;
    providerOrderId?: string | null;
    providerPaymentId?: string | null;
    paymentMethod?: string | null;
    paymentMethodDetail?: string | null;
    paidAt?: Date | null;
    fulfilledAt?: Date | null;
  };
}): Promise<void> {
  try {
    const to = (env.ADMIN_NOTIFY_EMAIL || mailConfig.user || '').trim();
    const provider = createEmailProvider();
    if (!to || !provider) {
      logger.warn('Purchase admin email skipped — notify address or SMTP missing', {
        orderId: input.order.id,
        hasTo: Boolean(to),
        hasProvider: Boolean(provider),
      });
      return;
    }

    const amountInr = (input.order.amountMinor / 100).toFixed(0);
    const subject = `New Wedding Pass purchase — ₹${amountInr} — ${input.user.email}`;
    const when = formatIst(input.order.fulfilledAt ?? input.order.paidAt);
    const method =
      [input.order.paymentMethod, input.order.paymentMethodDetail]
        .filter(Boolean)
        .join(' · ') || '—';

    const lines = [
      'New Wedding Pass purchase',
      '',
      `Name: ${input.user.name}`,
      `Email: ${input.user.email}`,
      `Phone: ${input.user.phone?.trim() || '—'}`,
      '',
      `Plan: ${input.order.planSlug}`,
      `Amount: ₹${amountInr} ${input.order.currency}`,
      `Payment method: ${method}`,
      `Provider order: ${input.order.providerOrderId || '—'}`,
      `Provider payment: ${input.order.providerPaymentId || '—'}`,
      `Order id: ${input.order.id}`,
      `Time (IST): ${when}`,
      '',
      '— MarriageBio',
    ];
    const text = lines.join('\n');
    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#2A1517;max-width:560px">
        <h2 style="margin:0 0 12px">New Wedding Pass purchase</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.user.name)}<br/>
        <strong>Email:</strong> ${escapeHtml(input.user.email)}<br/>
        <strong>Phone:</strong> ${escapeHtml(input.user.phone?.trim() || '—')}</p>
        <p><strong>Plan:</strong> ${escapeHtml(input.order.planSlug)}<br/>
        <strong>Amount:</strong> ₹${amountInr} ${escapeHtml(input.order.currency)}<br/>
        <strong>Payment method:</strong> ${escapeHtml(method)}<br/>
        <strong>Provider order:</strong> ${escapeHtml(input.order.providerOrderId || '—')}<br/>
        <strong>Provider payment:</strong> ${escapeHtml(input.order.providerPaymentId || '—')}<br/>
        <strong>Order id:</strong> ${escapeHtml(input.order.id)}<br/>
        <strong>Time (IST):</strong> ${escapeHtml(when)}</p>
        <p style="margin-top:24px">— MarriageBio</p>
      </div>
    `.trim();

    await provider.send({ to, subject, text, html });
    logger.info('Purchase admin email sent', {
      to,
      orderId: input.order.id,
    });
  } catch (error) {
    logger.error('Failed to send purchase admin email', {
      orderId: input.order.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
