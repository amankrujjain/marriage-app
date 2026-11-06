import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from 'pdf-lib';
import { PREMIUM_DURATION_DAYS, WEDDING_PASS_PLAN_NAME } from '@marriage/shared';

const A4_W = 595.28;
const A4_H = 841.89;

const CREAM = rgb(250 / 255, 246 / 255, 236 / 255);
const MAROON = rgb(104 / 255, 20 / 255, 33 / 255);
const GOLD = rgb(180 / 255, 133 / 255, 44 / 255);
const INK = rgb(42 / 255, 21 / 255, 23 / 255);
const MUTED = rgb(107 / 255, 74 / 255, 78 / 255);
const RULE = rgb(217 / 255, 207 / 255, 192 / 255);

const MARGIN_X = 51; // ~18mm
const MARGIN_TOP = 45; // ~16mm
const MARGIN_BOTTOM = 40;

function formatIstDate(value: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
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

function resolveAsset(...parts: string[]): string {
  const candidates = [
    path.resolve(process.cwd(), 'src', 'data', 'invoice', ...parts),
    path.resolve(process.cwd(), 'data', 'invoice', ...parts),
    path.resolve(__dirname, '../../data/invoice', ...parts),
  ];
  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }
  throw new Error(`Invoice asset missing: ${parts.join('/')}`);
}

function amountInrWords(amountMinor: number): string {
  const rupees = Math.floor(Math.max(0, amountMinor) / 100);
  const paise = Math.max(0, amountMinor) % 100;
  const rupeeWords = numberToIndianWords(rupees);
  if (paise === 0) return `Rupees ${rupeeWords} only`;
  return `Rupees ${rupeeWords} and ${numberToIndianWords(paise)} paise only`;
}

function numberToIndianWords(n: number): string {
  if (n === 0) return 'zero';
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  function underThousand(value: number): string {
    const parts: string[] = [];
    const h = Math.floor(value / 100);
    const r = value % 100;
    if (h) parts.push(`${ones[h]} hundred`);
    if (r < 20) {
      if (r) parts.push(ones[r]!);
    } else {
      parts.push(tens[Math.floor(r / 10)]!);
      if (r % 10) parts.push(ones[r % 10]!);
    }
    return parts.join(' ');
  }

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  const out: string[] = [];
  if (crore) out.push(`${underThousand(crore)} crore`);
  if (lakh) out.push(`${underThousand(lakh)} lakh`);
  if (thousand) out.push(`${underThousand(thousand)} thousand`);
  if (rest) out.push(underThousand(rest));
  return out.join(' ');
}

function formatMoney(amountMinor: number): string {
  // Helvetica (WinAnsi) cannot encode ₹ — use Rs. for pdf-lib StandardFonts.
  return `Rs. ${(amountMinor / 100).toFixed(2)}`;
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color = INK,
): void {
  page.drawText(text, { x, y, size, font, color });
}

function drawRight(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  size: number,
  font: PDFFont,
  color = INK,
): void {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightX - width, y, size, font, color });
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

  // Cream page background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_W,
    height: A4_H,
    color: CREAM,
  });

  const logoBytes = fs.readFileSync(resolveAsset('logo-horizontal-light@2x.png'));
  const wmBytes = fs.readFileSync(resolveAsset('watermark-seal-gold.png'));
  const logo: PDFImage = await pdf.embedPng(logoBytes);
  const watermark: PDFImage = await pdf.embedPng(wmBytes);

  // Watermark — large, low opacity, lower-center (matches design)
  const wmSize = 270;
  page.drawImage(watermark, {
    x: (A4_W - wmSize) / 2,
    y: 180,
    width: wmSize,
    height: wmSize,
    opacity: 0.06,
  });

  const contentRight = A4_W - MARGIN_X;
  let y = A4_H - MARGIN_TOP;

  // Header: logo left, Tax Invoice right
  const logoH = 42;
  const logoW = (logo.width / logo.height) * logoH;
  page.drawImage(logo, {
    x: MARGIN_X,
    y: y - logoH,
    width: logoW,
    height: logoH,
  });

  drawRight(page, 'Tax Invoice', contentRight, y - 28, 28, bold, MAROON);
  drawRight(
    page,
    `No. ${input.invoiceNumber}`,
    contentRight,
    y - 46,
    9,
    font,
    MUTED,
  );
  drawRight(
    page,
    formatIstDate(input.issuedAt),
    contentRight,
    y - 58,
    9,
    font,
    MUTED,
  );

  y -= Math.max(logoH, 64) + 18;

  // Double gold rule
  page.drawRectangle({
    x: MARGIN_X,
    y: y + 2,
    width: contentRight - MARGIN_X,
    height: 0.8,
    color: GOLD,
  });
  page.drawRectangle({
    x: MARGIN_X,
    y: y - 2,
    width: contentRight - MARGIN_X,
    height: 0.8,
    color: GOLD,
  });
  y -= 28;

  // Parties
  const colGap = 28;
  const colW = (contentRight - MARGIN_X - colGap) / 2;
  const leftX = MARGIN_X;
  const rightColX = MARGIN_X + colW + colGap;

  drawText(page, 'FROM', leftX, y, 8, bold, MAROON);
  drawText(page, 'BILLED TO', rightColX, y, 8, bold, MAROON);
  y -= 16;

  drawText(page, 'MarriageBio', leftX, y, 11, bold, INK);
  drawText(page, input.user.name?.trim() || 'Customer', rightColX, y, 11, bold, INK);
  y -= 14;

  const fromLines = ['marriagebio.in', 'support@marriagebio.in'];
  const toLines = [
    input.user.email?.trim() || '—',
    input.user.phone?.trim() || '—',
  ];
  const partyLines = Math.max(fromLines.length, toLines.length);
  for (let i = 0; i < partyLines; i += 1) {
    if (fromLines[i]) drawText(page, fromLines[i]!, leftX, y, 9, font, INK);
    if (toLines[i]) drawText(page, toLines[i]!, rightColX, y, 9, font, INK);
    y -= 13;
  }

  y -= 18;

  // Items table
  const cols = {
    desc: MARGIN_X,
    hsn: MARGIN_X + 220,
    qty: MARGIN_X + 300,
    rate: MARGIN_X + 370,
    amt: contentRight,
  };

  page.drawRectangle({
    x: MARGIN_X,
    y: y - 2,
    width: contentRight - MARGIN_X,
    height: 1.2,
    color: INK,
  });
  y -= 16;

  drawText(page, 'DESCRIPTION', cols.desc, y, 8, bold, MUTED);
  drawText(page, 'HSN/SAC', cols.hsn, y, 8, bold, MUTED);
  drawRight(page, 'QTY', cols.qty + 28, y, 8, bold, MUTED);
  drawRight(page, 'RATE', cols.rate + 40, y, 8, bold, MUTED);
  drawRight(page, 'AMOUNT', cols.amt, y, 8, bold, MUTED);
  y -= 8;

  page.drawRectangle({
    x: MARGIN_X,
    y: y,
    width: contentRight - MARGIN_X,
    height: 0.8,
    color: INK,
  });
  y -= 18;

  const amount = formatMoney(input.order.amountMinor);
  const planLabel = `${WEDDING_PASS_PLAN_NAME}, ${PREMIUM_DURATION_DAYS} days`;
  drawText(page, planLabel, cols.desc, y, 10, font, INK);
  drawText(page, '—', cols.hsn, y, 10, font, MUTED);
  drawRight(page, '1', cols.qty + 28, y, 10, font, INK);
  drawRight(page, amount, cols.rate + 40, y, 10, font, INK);
  drawRight(page, amount, cols.amt, y, 10, font, INK);
  y -= 10;

  page.drawRectangle({
    x: MARGIN_X,
    y: y,
    width: contentRight - MARGIN_X,
    height: 0.6,
    color: RULE,
  });
  y -= 28;

  // Totals (right aligned block)
  const totLabelX = contentRight - 175;
  const totValueX = contentRight;
  const drawTot = (label: string, value: string, strong = false) => {
    drawText(page, label, totLabelX, y, strong ? 11 : 9.5, strong ? bold : font, INK);
    drawRight(page, value, totValueX, y, strong ? 11 : 9.5, strong ? bold : font, INK);
  };

  drawTot('Taxable value', amount);
  y -= 6;
  page.drawRectangle({
    x: totLabelX,
    y,
    width: totValueX - totLabelX,
    height: 0.5,
    color: RULE,
  });
  y -= 16;

  // No GST split until GSTIN/rates are configured — total equals taxable.
  page.drawRectangle({
    x: totLabelX,
    y: y + 12,
    width: totValueX - totLabelX,
    height: 1.2,
    color: INK,
  });
  drawTot('Total', amount, true);
  y -= 8;
  page.drawRectangle({
    x: totLabelX,
    y,
    width: totValueX - totLabelX,
    height: 1.2,
    color: INK,
  });

  // Footer block
  const method =
    [input.order.paymentMethod, input.order.paymentMethodDetail]
      .filter(Boolean)
      .join(' · ') || '—';
  const txn =
    input.order.providerPaymentId ||
    input.order.providerOrderId ||
    '—';

  const footerY = MARGIN_BOTTOM + 70;
  page.drawRectangle({
    x: MARGIN_X,
    y: footerY + 36,
    width: contentRight - MARGIN_X,
    height: 0.6,
    color: RULE,
  });

  drawText(page, 'Amount in words:', MARGIN_X, footerY + 18, 9, bold, INK);
  const words = amountInrWords(input.order.amountMinor);
  const wordsCapitalized = words.charAt(0).toUpperCase() + words.slice(1);
  drawText(page, wordsCapitalized, MARGIN_X + 95, footerY + 18, 9, font, INK);

  drawText(page, `Payment method: ${method}`, MARGIN_X, footerY, 9, font, MUTED);
  drawText(page, `Txn ID: ${txn}`, MARGIN_X, footerY - 13, 9, font, MUTED);

  drawText(page, 'support: support@marriagebio.in', MARGIN_X, footerY - 32, 8, font, MUTED);
  drawRight(page, 'marriagebio.in', contentRight, footerY - 32, 8, font, MUTED);

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
