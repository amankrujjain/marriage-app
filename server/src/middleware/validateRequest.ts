import type { NextFunction, Request, Response } from 'express';
import type { ObjectSchema } from 'joi';
import { ValidationError } from '../errors/ValidationError';

interface Schemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

function applyValidated(req: Request, key: 'body' | 'params' | 'query', value: unknown): void {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

export function validateRequest(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        next(new ValidationError('Invalid request body', error.details));
        return;
      }
      applyValidated(req, 'body', value);
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, { abortEarly: false });
      if (error) {
        next(new ValidationError('Invalid request params', error.details));
        return;
      }
      applyValidated(req, 'params', value);
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, { abortEarly: false });
      if (error) {
        next(new ValidationError('Invalid request query', error.details));
        return;
      }
      applyValidated(req, 'query', value);
    }

    next();
  };
}
