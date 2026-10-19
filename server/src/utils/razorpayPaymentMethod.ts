export type PaymentMethodInfo = {
  paymentMethod: string;
  paymentMethodDetail: string | null;
};

/** Normalize Razorpay `method` (+ card/upi/bank fields) for admin display. */
export function extractRazorpayPaymentMethod(
  payment: Record<string, unknown> | null | undefined,
): PaymentMethodInfo {
  if (!payment) {
    return { paymentMethod: 'unknown', paymentMethodDetail: null };
  }

  const method = String(payment.method ?? 'unknown').toLowerCase();

  if (method === 'upi') {
    const vpa =
      (typeof payment.vpa === 'string' && payment.vpa) ||
      (typeof (payment.upi as { vpa?: string } | undefined)?.vpa === 'string'
        ? (payment.upi as { vpa: string }).vpa
        : null);
    return {
      paymentMethod: 'upi',
      paymentMethodDetail: vpa ? `UPI · ${maskVpa(vpa)}` : 'UPI',
    };
  }

  if (method === 'card') {
    const card = payment.card as
      | { network?: string; type?: string; last4?: string }
      | undefined;
    const network = card?.network ? titleCase(card.network) : 'Card';
    const kind =
      card?.type === 'debit'
        ? 'Debit card'
        : card?.type === 'credit'
          ? 'Credit card'
          : 'Card';
    const last4 = card?.last4 ? ` ••${card.last4}` : '';
    return {
      paymentMethod: 'card',
      paymentMethodDetail: `${kind} · ${network}${last4}`,
    };
  }

  if (method === 'netbanking') {
    const bank = typeof payment.bank === 'string' ? payment.bank : null;
    return {
      paymentMethod: 'netbanking',
      paymentMethodDetail: bank ? `Netbanking · ${bank}` : 'Netbanking',
    };
  }

  if (method === 'wallet') {
    const wallet = typeof payment.wallet === 'string' ? payment.wallet : null;
    return {
      paymentMethod: 'wallet',
      paymentMethodDetail: wallet ? `Wallet · ${titleCase(wallet)}` : 'Wallet',
    };
  }

  if (method === 'emi' || method === 'cardless_emi') {
    return {
      paymentMethod: method,
      paymentMethodDetail: method === 'emi' ? 'EMI' : 'Cardless EMI',
    };
  }

  if (method === 'paylater') {
    return { paymentMethod: 'paylater', paymentMethodDetail: 'Pay later' };
  }

  return {
    paymentMethod: method || 'unknown',
    paymentMethodDetail: method ? titleCase(method.replace(/_/g, ' ')) : null,
  };
}

function maskVpa(vpa: string): string {
  const [user, host] = vpa.split('@');
  if (!host) return '•••';
  if (!user || user.length <= 2) return `••@${host}`;
  return `${user.slice(0, 2)}••@${host}`;
}

function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
