import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
  BlogSitemapEntry,
  PublicBlogPostLookup,
  PublicBlogPostSummary,
} from '@marriage/shared';

function apiBase(): string {
  return (
    process.env.API_INTERNAL_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'http://localhost:4000/api/v1'
  );
}

export class BlogFetchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly operation: string,
  ) {
    super(message);
    this.name = 'BlogFetchError';
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof BlogFetchError && error.status === 404;
}

type ListOpts = {
  page?: number;
  limit?: number;
  excludeSlug?: string;
  revalidate?: number;
};

export type PublicBlogListResult = {
  items: PublicBlogPostSummary[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export async function listPublicBlogPosts(
  opts: ListOpts = {},
): Promise<PublicBlogListResult> {
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 9;
  const q = new URLSearchParams();
  q.set('page', String(page));
  q.set('limit', String(limit));
  if (opts.excludeSlug) q.set('excludeSlug', opts.excludeSlug);

  const url = `${apiBase()}/blog?${q.toString()}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      next: { revalidate: opts.revalidate ?? 60 },
    });
  } catch (err) {
    throw new BlogFetchError(
      err instanceof Error ? err.message : 'Network error',
      0,
      'listPublicBlogPosts',
    );
  }

  const json = (await response.json()) as
    | ApiPaginatedResponse<PublicBlogPostSummary>
    | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new BlogFetchError(
      err.message ?? 'Failed to list posts',
      response.status,
      'listPublicBlogPosts',
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(json.meta.total / Math.max(1, json.meta.limit)),
  );
  return {
    items: json.data,
    meta: { ...json.meta, totalPages },
  };
}

export async function getPublicBlogPost(
  slug: string,
  revalidate = 60,
): Promise<PublicBlogPostLookup> {
  const url = `${apiBase()}/blog/${encodeURIComponent(slug)}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      next: { revalidate },
    });
  } catch (err) {
    throw new BlogFetchError(
      err instanceof Error ? err.message : 'Network error',
      0,
      'getPublicBlogPost',
    );
  }

  const json = (await response.json()) as
    | ApiSuccessResponse<PublicBlogPostLookup>
    | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new BlogFetchError(
      err.message ?? 'Failed to load post',
      response.status,
      'getPublicBlogPost',
    );
  }

  return json.data;
}

export async function listBlogSitemapEntries(
  revalidate = 3600,
): Promise<BlogSitemapEntry[]> {
  const url = `${apiBase()}/blog/sitemap`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      next: { revalidate },
    });
  } catch (err) {
    throw new BlogFetchError(
      err instanceof Error ? err.message : 'Network error',
      0,
      'listBlogSitemapEntries',
    );
  }

  const json = (await response.json()) as
    | ApiSuccessResponse<BlogSitemapEntry[]>
    | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const err = json as ApiErrorResponse;
    throw new BlogFetchError(
      err.message ?? 'Failed to load blog sitemap',
      response.status,
      'listBlogSitemapEntries',
    );
  }

  return json.data;
}
