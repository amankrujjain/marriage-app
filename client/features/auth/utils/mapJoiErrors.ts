import type { ValidationError } from 'joi';

export function mapJoiErrors(error: ValidationError): Record<string, string> {
  const next: Record<string, string> = {};
  for (const detail of error.details) {
    next[String(detail.path[0] ?? 'form')] = detail.message;
  }
  return next;
}
