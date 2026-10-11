import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '@marriage/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new ApiClientError(
      err.message ?? 'Request failed',
      err.error?.code ?? 'ERROR',
      response.status,
    );
  }
  return json.data;
}

function baseHeaders(withJson: boolean): HeadersInit {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (withJson) headers['Content-Type'] = 'application/json';
  return headers;
}

async function tryRefreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: baseHeaders(false),
          credentials: 'include',
          cache: 'no-store',
        });
        return response.ok;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

async function request<T>(
  path: string,
  init: RequestInit,
  retried = false,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401 && !retried && !path.startsWith('/auth/refresh')) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return request<T>(path, init, true);
    }
  }

  return parseResponse<T>(response);
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'GET',
    headers: baseHeaders(false),
  });
}

export type PaginatedResult<T> = {
  items: T[];
  meta: ApiPaginatedResponse<T>['meta'];
};

export async function apiGetPaginated<T>(
  path: string,
  retried = false,
): Promise<PaginatedResult<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: baseHeaders(false),
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401 && !retried && !path.startsWith('/auth/refresh')) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return apiGetPaginated<T>(path, true);
    }
  }

  const json = (await response.json()) as ApiPaginatedResponse<T> | ApiErrorResponse;
  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new ApiClientError(
      err.message ?? 'Request failed',
      err.error?.code ?? 'ERROR',
      response.status,
    );
  }
  return { items: json.data, meta: json.meta };
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: baseHeaders(true),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    headers: baseHeaders(true),
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T = null>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'DELETE',
    headers: baseHeaders(false),
  });
}

export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: form,
  });
}
