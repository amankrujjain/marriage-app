import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const A4_W = 595.28;
const A4_H = 841.89;
const MARGIN = 48;

function formatIstDate(value: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value);
}

export function buildInvoiceNumber(orderId: string, issuedAt: Date): string {
  const y = issuedAt.toLocaleString('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  });
  const m = issuedAt.toLocaleString('en-CA', {
    timeZone: 'Asia/Kolkata',
    month: '2-digit',
  });
  const d = issuedAt.toLocaleString('en-CA', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
  });
  const tail = orderId.replace(/[^a-f0-9]/gi, '').slice(-6).toUpperCase() || '000000';
  return `INV-${y}${m}${d}-${tail}`;
}

export async function buildInvoicePdfBuffer(input: {
  invoiceNumber: string;
  issuedAt: Date;
  user: { name: string; email: string; phone?: string | null };
  order: {
    planSlug: string;
    amountMinor: number;
    currency: string;
    paymentMethod?: string | null;
    paymentMethodDetail?: string | null;
    providerOrderId?: string | null;
    providerPaymentId?: string | null;
  };
}): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([A4_W, A4_H]);
  let y = A4_H - MARGIN;
  const ink = rgb(0.16, 0.08, 0.09);

  const draw = (text: string, size: number, useBold = false, gap = 16) => {
    page.drawText(text, {
      x: MARGIN,
      y,
      size,
      font: useBold ? bold : font,
      color: ink,
    });
    y -= gap;
  };

  draw('MarriageBio', 20, true, 22);
  draw('Tax Invoice', 14, true, 20);
  draw(`Invoice #: ${input.invoiceNumber}`, 11, false, 14);
  draw(`Date (IST): ${formatIstDate(input.issuedAt)}`, 11, false, 22);

  draw('Bill to', 12, true, 16);
  draw(input.user.name || '—', 11, false, 14);
  draw(input.user.email || '—', 11, false, 14);
  draw(input.user.phone?.trim() || '—', 11, false, 22);

  const amountInr = (input.order.amountMinor / 100).toFixed(2);
  const method =
    [input.order.paymentMethod, input.order.paymentMethodDetail]
      .filter(Boolean)
      .join(' · ') || '—';

  draw('Line item', 12, true, 16);
  draw(`Wedding Pass — ${input.order.planSlug}`, 11, false, 14);
  draw('Qty: 1', 11, false, 14);
  draw(`Amount: ${input.order.currency} ${amountInr}`, 11, true, 22);

  draw('Payment', 12, true, 16);
  draw(`Mode: ${method}`, 11, false, 14);
  draw(`Razorpay order: ${input.order.providerOrderId || '—'}`, 10, false, 13);
  draw(`Razorpay payment: ${input.order.providerPaymentId || '—'}`, 10, false, 28);

  draw('support@marriagebio.in', 10, false, 13);
  draw('marriagebio.in', 10, false, 13);

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
