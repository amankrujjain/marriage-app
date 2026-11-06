import fs from 'fs';
import {
  buildInvoiceNumber,
  buildInvoicePdfBuffer,
} from '../src/services/billing/generateInvoicePdf';

async function main(): Promise<void> {
  const issuedAt = new Date();
  const buf = await buildInvoicePdfBuffer({
    invoiceNumber: buildInvoiceNumber('507f1f77bcf86cd799439011', issuedAt),
    issuedAt,
    user: {
      name: 'Aman Sharma',
      email: 'aman@example.com',
      phone: '+91 98765 43210',
    },
    order: {
      planSlug: 'wedding-pass',
      amountMinor: 15100,
      currency: 'INR',
      paymentMethod: 'upi',
      paymentMethodDetail: 'UPI · gpay',
      providerOrderId: 'order_TEST123',
      providerPaymentId: 'pay_TEST456',
    },
  });
  const out = 'C:/Users/ASUS/Downloads/marriagebio-invoice-sample.pdf';
  fs.writeFileSync(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
