import {
  PaymentOrderModel,
  type PaymentOrderDocument,
} from '../../models/PaymentOrder';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import { logger } from '../../utils/logger';
import {
  buildInvoiceNumber,
  buildInvoicePdfBuffer,
} from './generateInvoicePdf';

export async function issueInvoiceForOrder(input: {
  order: PaymentOrderDocument;
  user: { name: string; email: string; phone?: string | null };
}): Promise<{
  invoiceNumber: string;
  invoiceKey: string;
  downloadUrl: string;
}> {
  const { order, user } = input;
  const provider = createStorageProvider();
  const userId = order.userId.toString();

  if (order.invoiceKey && order.invoiceNumber) {
    const downloadUrl = await provider.signedUrl(order.invoiceKey, {
      downloadName: `${order.invoiceNumber}.pdf`,
      fromNow: true,
    });
    return {
      invoiceNumber: order.invoiceNumber,
      invoiceKey: order.invoiceKey,
      downloadUrl,
    };
  }

  const issuedAt = order.fulfilledAt ?? order.paidAt ?? new Date();
  const invoiceNumber = buildInvoiceNumber(order._id.toString(), issuedAt);
  const buffer = await buildInvoicePdfBuffer({
    invoiceNumber,
    issuedAt,
    user,
    order: {
      planSlug: order.planSlug,
      amountMinor: order.amountMinor,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
      paymentMethodDetail: order.paymentMethodDetail,
      providerOrderId: order.providerOrderId,
      providerPaymentId: order.providerPaymentId,
    },
  });

  const key = mediaKey('userInvoices', 'pdf', userId);
  await provider.upload({
    buffer,
    mimeType: 'application/pdf',
    key,
    access: 'private',
    cacheControl: 'private, no-store',
    contentDisposition: `attachment; filename="${invoiceNumber}.pdf"`,
  });

  const claimed = await PaymentOrderModel.findOneAndUpdate(
    { _id: order._id, invoiceKey: null },
    {
      $set: {
        invoiceNumber,
        invoiceKey: key,
        invoiceGeneratedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!claimed) {
    const latest = await PaymentOrderModel.findById(order._id);
    if (latest?.invoiceKey && latest.invoiceNumber) {
      // Race: another worker won — drop orphan key best-effort.
      try {
        await provider.delete(key, 'private');
      } catch (error) {
        logger.warn('Orphan invoice cleanup failed', {
          key,
          message: error instanceof Error ? error.message : String(error),
        });
      }
      order.invoiceKey = latest.invoiceKey;
      order.invoiceNumber = latest.invoiceNumber;
      order.invoiceGeneratedAt = latest.invoiceGeneratedAt;
      const downloadUrl = await provider.signedUrl(latest.invoiceKey, {
        downloadName: `${latest.invoiceNumber}.pdf`,
        fromNow: true,
      });
      return {
        invoiceNumber: latest.invoiceNumber,
        invoiceKey: latest.invoiceKey,
        downloadUrl,
      };
    }
    throw new Error('Failed to persist invoice on payment order');
  }

  order.invoiceNumber = claimed.invoiceNumber;
  order.invoiceKey = claimed.invoiceKey;
  order.invoiceGeneratedAt = claimed.invoiceGeneratedAt;

  const downloadUrl = await provider.signedUrl(key, {
    downloadName: `${invoiceNumber}.pdf`,
    fromNow: true,
  });

  return { invoiceNumber, invoiceKey: key, downloadUrl };
}
