import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details?: unknown) {
    super(message, 400, code, details);
    this.name = 'BadRequestError';
  }
}
