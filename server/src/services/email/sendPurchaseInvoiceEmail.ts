import { createEmailProvider } from '../../providers/email/createEmailProvider';
import { logger } from '../../utils/logger';

export async function sendPurchaseInvoiceEmail(input: {
  to: string;
  invoiceNumber: string;
  planSlug: string;
  amountMinor: number;
  currency: string;
  downloadUrl: string;
}): Promise<void> {
  try {
    const provider = createEmailProvider();
    if (!provider) {
      logger.warn('Purchase invoice email skipped — SMTP not configured', {
        to: input.to,
        invoiceNumber: input.invoiceNumber,
      });
      return;
    }

    const amountInr = (input.amountMinor / 100).toFixed(0);
    const subject = `Your MarriageBio invoice ${input.invoiceNumber}`;
    const text = [
      'Thank you for your MarriageBio Wedding Pass purchase.',
      '',
      `Plan: ${input.planSlug}`,
      `Amount: ₹${amountInr} ${input.currency}`,
      `Invoice: ${input.invoiceNumber}`,
      '',
      'Download your invoice (link expires in 7 days):',
      input.downloadUrl,
      '',
      'Questions? Email support@marriagebio.in',
      '',
      '— MarriageBio',
    ].join('\n');

    const html = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#2A1517;max-width:560px">
        <p>Thank you for your MarriageBio Wedding Pass purchase.</p>
        <p>
          <strong>Plan:</strong> ${escapeHtml(input.planSlug)}<br/>
          <strong>Amount:</strong> ₹${amountInr} ${escapeHtml(input.currency)}<br/>
          <strong>Invoice:</strong> ${escapeHtml(input.invoiceNumber)}
        </p>
        <p>
          <a href="${escapeAttr(input.downloadUrl)}" style="display:inline-block;padding:12px 18px;background:#681421;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">
            Download invoice
          </a>
        </p>
        <p style="color:#5B4548;font-size:14px">This download link expires in 7 days.</p>
        <p style="color:#5B4548;font-size:14px">Questions? Email support@marriagebio.in</p>
        <p style="margin-top:24px">— MarriageBio</p>
      </div>
    `.trim();

    await provider.send({ to: input.to, subject, text, html });
    logger.info('Purchase invoice email sent', {
      to: input.to,
      invoiceNumber: input.invoiceNumber,
    });
  } catch (error) {
    logger.error('Failed to send purchase invoice email', {
      to: input.to,
      invoiceNumber: input.invoiceNumber,
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

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}
