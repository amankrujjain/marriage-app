export function formatInr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 16);
  }
}

export function toInputDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function defaultRangeDays(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - (days - 1));
  return { from: toInputDate(from), to: toInputDate(to) };
}

export const PAYMENT_STATUSES = [
  '',
  'fulfilled',
  'pending',
  'created',
  'paid',
  'failed',
  'cancelled',
  'refunded',
] as const;

export const PAYMENT_METHODS = [
  { value: '', label: 'All modes' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'netbanking', label: 'Netbanking' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'emi', label: 'EMI' },
  { value: 'paylater', label: 'Pay later' },
  { value: 'unknown', label: 'Unknown' },
] as const;

export function formatPaymentMethod(
  method: string | null | undefined,
  detail: string | null | undefined,
): string {
  if (detail?.trim()) return detail.trim();
  if (!method) return '—';
  const map: Record<string, string> = {
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Netbanking',
    wallet: 'Wallet',
    emi: 'EMI',
    cardless_emi: 'Cardless EMI',
    paylater: 'Pay later',
  };
  return map[method] ?? method;
}
