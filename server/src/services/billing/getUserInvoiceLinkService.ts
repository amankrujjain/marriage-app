import { Types } from 'mongoose';
import { NotFoundError } from '../../errors/NotFoundError';
import { PaymentOrderModel } from '../../models/PaymentOrder';
import { UserModel } from '../../models/User';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { issueInvoiceForOrder } from './issueInvoiceForOrder';

export async function getUserInvoiceLinkService(input: {
  userId: string;
  orderId: string;
}): Promise<{ url: string; invoiceNumber: string; expiresInDays: 7 }> {
  if (!Types.ObjectId.isValid(input.orderId)) {
    throw new NotFoundError('Payment order not found', 'ORDER_NOT_FOUND');
  }

  const order = await PaymentOrderModel.findOne({
    _id: input.orderId,
    userId: input.userId,
  });
  if (!order || order.status !== 'fulfilled') {
    throw new NotFoundError('Payment order not found', 'ORDER_NOT_FOUND');
  }

  if (order.invoiceKey && order.invoiceNumber) {
    const url = await createStorageProvider().signedUrl(order.invoiceKey, {
      downloadName: `${order.invoiceNumber}.pdf`,
      fromNow: true,
    });
    return {
      url,
      invoiceNumber: order.invoiceNumber,
      expiresInDays: 7,
    };
  }

  const user = await UserModel.findById(input.userId);
  if (!user) {
    throw new NotFoundError('Payment order not found', 'ORDER_NOT_FOUND');
  }

  const issued = await issueInvoiceForOrder({
    order,
    user: { name: user.name, email: user.email, phone: user.phone },
  });

  return {
    url: issued.downloadUrl,
    invoiceNumber: issued.invoiceNumber,
    expiresInDays: 7,
  };
}
