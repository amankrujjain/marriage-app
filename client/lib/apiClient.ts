import type { ApiErrorResponse, ApiSuccessResponse } from '@marriage/shared';
import { getAccessToken } from './tokenStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new ApiClientError(err.message ?? 'Request failed', err.error?.code ?? 'ERROR');
  }
  return json.data;
}

function authHeaders(withJson: boolean): HeadersInit {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (withJson) headers['Content-Type'] = 'application/json';
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(false),
    cache: 'no-store',
  });
  return parseResponse<T>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(true),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  return parseResponse<T>(response);
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: authHeaders(true),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return parseResponse<T>(response);
}
