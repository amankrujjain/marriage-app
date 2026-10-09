import { AppError } from './AppError';

export class PaymentError extends AppError {
  constructor(message = 'Payment error', code = 'PAYMENT_ERROR') {
    super(message, 402, code);
    this.name = 'PaymentError';
  }
}
