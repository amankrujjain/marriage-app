import type { Response } from 'express';
import type { ApiPaginatedResponse } from '@marriage/shared';

interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginatedMeta,
  message = 'Fetched successfully',
): void {
  const body: ApiPaginatedResponse<T> = {
    success: true,
    message,
    data,
    meta,
  };
  res.status(200).json(body);
}
