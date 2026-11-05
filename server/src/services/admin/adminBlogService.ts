import {
  BlogPostStatus,
  type AdminBlogPost,
  type AdminBlogPostSummary,
  type BlogImageUploadResult,
  type CreateBlogPostPayload,
  type UpdateBlogPostPayload,
} from '@marriage/shared';
import { Types } from 'mongoose';
import { env } from '../../config/env';
import { BadRequestError } from '../../errors/BadRequestError';
import { ConflictError } from '../../errors/ConflictError';
import { NotFoundError } from '../../errors/NotFoundError';
import type { BlogPostFields } from '../../models/BlogPost';
import { createStorageProvider } from '../../providers/storage/createStorageProvider';
import { mediaKey } from '../../providers/storage/R2StorageProvider';
import {
  createBlogPost,
  findBlogPostById,
  isBlogSlugTaken,
  listAdminBlogPosts,
  pullPreviousSlugFromOtherPosts,
  updateBlogPostById,
} from '../../repositories/blogPostRepository';
import { findUserById } from '../../repositories/userRepository';
import { isReservedBlogSlug, slugifyBlogTitle } from '../../utils/blogSlug';
import { detectImageMime } from '../../utils/imageMagic';
import { logger } from '../../utils/logger';
import {
  optimizeImage,
  type OptimizedImage,
} from '../../utils/optimizeImage';
import { sanitizeBlogHtml } from '../../utils/sanitizeBlogHtml';
import {
  toAdminBlogPost,
  toAdminBlogPostSummary,
} from '../../utils/toAdminBlogPost';
import {
  blogRevalidatePaths,
  notifyBlogRevalidate,
} from '../blog/notifyRevalidate';

function emptyToNull(v: string | null | undefined): string | null {
  if (v == null || v === '') return null;
  return v;
}

function normalizeList(
  values: string[] | undefined,
  max: number,
): string[] | undefined {
  if (values === undefined) return undefined;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
    if (out.length >= max) break;
  }
  return out;
}

function assertSlugAllowed(slug: string): void {
  if (isReservedBlogSlug(slug)) {
    throw new BadRequestError('This slug is reserved', 'BLOG_SLUG_RESERVED');
  }
}

async function ensureUniqueBlogSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  for (let i = 0; i <= 200; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i}`;
    if (isReservedBlogSlug(candidate)) continue;
    if (!(await isBlogSlugTaken(candidate, excludeId))) {
      return candidate;
    }
  }
  throw new ConflictError(
    'Could not generate a unique slug',
    'BLOG_SLUG_TAKEN',
  );
}

function notFound(): never {
  throw new NotFoundError('Blog post not found', 'BLOG_POST_NOT_FOUND');
}

function isMongoDuplicateKey(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 11000
  );
}

function hasPublishableContent(contentHtml: string): boolean {
  const text = contentHtml.replace(/<[^>]*>/g, '').trim();
  if (text !== '') return true;
  return /<img\b/i.test(contentHtml);
}

function assertPublishableContent(contentHtml: string): void {
  if (!hasPublishableContent(contentHtml)) {
    throw new BadRequestError(
      'Add content before publishing',
      'BLOG_CONTENT_REQUIRED',
    );
  }
}

export async function listAdminBlogPostsService(input: {
  page: number;
  limit: number;
  status?: BlogPostStatus;
  search?: string;
}): Promise<{ items: AdminBlogPostSummary[]; total: number }> {
  const search =
    input.search && input.search.trim() !== ''
      ? input.search.trim()
      : undefined;
  const { items, total } = await listAdminBlogPosts({
    page: input.page,
    limit: input.limit,
    status: input.status,
    search,
  });
  return { items: items.map(toAdminBlogPostSummary), total };
}

export async function getAdminBlogPostService(
  id: string,
): Promise<AdminBlogPost> {
  const doc = await findBlogPostById(id);
  if (!doc) notFound();
  return toAdminBlogPost(doc);
}

export async function createAdminBlogPostService(
  adminId: string,
  payload: CreateBlogPostPayload,
): Promise<AdminBlogPost> {
  const admin = await findUserById(adminId);

  let slug: string;
  if (payload.slug) {
    assertSlugAllowed(payload.slug);
    if (await isBlogSlugTaken(payload.slug)) {
      throw new ConflictError('Slug already in use', 'BLOG_SLUG_TAKEN');
    }
    slug = payload.slug;
  } else {
    slug = await ensureUniqueBlogSlug(slugifyBlogTitle(payload.title));
  }

  await pullPreviousSlugFromOtherPosts(slug);

  const contentHtml = sanitizeBlogHtml(payload.contentHtml ?? '');
  const tags = normalizeList(payload.tags, 12) ?? [];
  const keywords = normalizeList(payload.keywords, 20) ?? [];

  try {
    const doc = await createBlogPost({
      title: payload.title,
      slug,
      previousSlugs: [],
      excerpt: payload.excerpt ?? '',
      contentHtml,
      contentJson: payload.contentJson ?? null,
      coverImageUrl: emptyToNull(payload.coverImageUrl),
      coverAlt: payload.coverAlt ?? '',
      ogImageUrl: emptyToNull(payload.ogImageUrl),
      canonicalUrl: emptyToNull(payload.canonicalUrl),
      noindex: payload.noindex ?? false,
      featured: payload.featured ?? false,
      tags,
      category: payload.category ?? '',
      keywords,
      seoTitle: payload.seoTitle ?? '',
      seoDescription: payload.seoDescription ?? '',
      focusKeyword: payload.focusKeyword ?? '',
      status: BlogPostStatus.DRAFT,
      publishAt: null,
      publishedAt: null,
      authorId: new Types.ObjectId(adminId),
      authorName: admin?.name ?? '',
      updatedBy: new Types.ObjectId(adminId),
      deletedAt: null,
    });
    // HOOK phases 3/6: revalidation pings go after create, update, publish, unpublish and delete.
    return toAdminBlogPost(doc);
  } catch (error) {
    if (isMongoDuplicateKey(error)) {
      throw new ConflictError('Slug already in use', 'BLOG_SLUG_TAKEN');
    }
    throw error;
  }
}

export async function updateAdminBlogPostService(
  adminId: string,
  id: string,
  payload: UpdateBlogPostPayload,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  const set: Partial<BlogPostFields> = {
    updatedBy: new Types.ObjectId(adminId),
  };

  if (payload.title !== undefined) set.title = payload.title;
  if (payload.excerpt !== undefined) set.excerpt = payload.excerpt;
  if (payload.contentHtml !== undefined) {
    set.contentHtml = sanitizeBlogHtml(payload.contentHtml);
  }
  if (payload.contentJson !== undefined) set.contentJson = payload.contentJson;
  let oldCoverKey: string | null | undefined;
  if (payload.coverImageUrl !== undefined) {
    const nextUrl = emptyToNull(payload.coverImageUrl);
    set.coverImageUrl = nextUrl;
    if (post.coverImageKey && nextUrl !== post.coverImageUrl) {
      set.coverImageKey = null;
      oldCoverKey = post.coverImageKey;
    }
  }
  if (payload.coverAlt !== undefined) set.coverAlt = payload.coverAlt;
  if (payload.ogImageUrl !== undefined) {
    set.ogImageUrl = emptyToNull(payload.ogImageUrl);
  }
  if (payload.canonicalUrl !== undefined) {
    set.canonicalUrl = emptyToNull(payload.canonicalUrl);
  }
  if (payload.noindex !== undefined) set.noindex = payload.noindex;
  if (payload.featured !== undefined) set.featured = payload.featured;
  if (payload.tags !== undefined) set.tags = normalizeList(payload.tags, 12)!;
  if (payload.category !== undefined) set.category = payload.category;
  if (payload.keywords !== undefined) {
    set.keywords = normalizeList(payload.keywords, 20)!;
  }
  if (payload.seoTitle !== undefined) set.seoTitle = payload.seoTitle;
  if (payload.seoDescription !== undefined) {
    set.seoDescription = payload.seoDescription;
  }
  if (payload.focusKeyword !== undefined) {
    set.focusKeyword = payload.focusKeyword;
  }

  // A title change does NOT change the slug; URLs stay stable.
  const previousSlug =
    payload.slug !== undefined && payload.slug !== post.slug
      ? post.slug
      : null;
  if (payload.slug !== undefined && payload.slug !== post.slug) {
    assertSlugAllowed(payload.slug);
    if (await isBlogSlugTaken(payload.slug, id)) {
      throw new ConflictError('Slug already in use', 'BLOG_SLUG_TAKEN');
    }
    set.slug = payload.slug;
    const previous = Array.isArray(post.previousSlugs)
      ? post.previousSlugs
      : [];
    set.previousSlugs = [
      ...new Set([...previous, post.slug].filter((s) => s !== payload.slug)),
    ];
    await pullPreviousSlugFromOtherPosts(payload.slug, id);
  }

  try {
    const updated = await updateBlogPostById(id, set);
    if (!updated) notFound();
    if (oldCoverKey) {
      await deleteBlogImageQuietly(oldCoverKey);
    }
    if (
      post.status === BlogPostStatus.PUBLISHED ||
      updated.status === BlogPostStatus.PUBLISHED
    ) {
      void notifyBlogRevalidate(
        blogRevalidatePaths({
          slug: updated.slug,
          previousSlug,
        }),
      );
    }
    return toAdminBlogPost(updated);
  } catch (error) {
    if (isMongoDuplicateKey(error)) {
      throw new ConflictError('Slug already in use', 'BLOG_SLUG_TAKEN');
    }
    throw error;
  }
}

export async function publishAdminBlogPostService(
  adminId: string,
  id: string,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  if (!post.title?.trim()) {
    throw new BadRequestError(
      'Add content before publishing',
      'BLOG_CONTENT_REQUIRED',
    );
  }
  assertPublishableContent(post.contentHtml ?? '');

  const updated = await updateBlogPostById(id, {
    status: BlogPostStatus.PUBLISHED,
    publishedAt: post.publishedAt ?? new Date(),
    publishAt: null,
    updatedBy: new Types.ObjectId(adminId),
  });
  if (!updated) notFound();
  void notifyBlogRevalidate(blogRevalidatePaths({ slug: updated.slug }));
  return toAdminBlogPost(updated);
}

export async function unpublishAdminBlogPostService(
  adminId: string,
  id: string,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  const updated = await updateBlogPostById(id, {
    status: BlogPostStatus.DRAFT,
    publishAt: null,
    updatedBy: new Types.ObjectId(adminId),
  });
  if (!updated) notFound();
  if (post.status === BlogPostStatus.PUBLISHED) {
    void notifyBlogRevalidate(blogRevalidatePaths({ slug: updated.slug }));
  }
  return toAdminBlogPost(updated);
}

export async function scheduleAdminBlogPostService(
  adminId: string,
  id: string,
  publishAt: Date,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  if (post.status === BlogPostStatus.PUBLISHED) {
    throw new ConflictError(
      'Unpublish the post before scheduling it',
      'BLOG_ALREADY_PUBLISHED',
    );
  }

  if (publishAt.getTime() <= Date.now() + 60000) {
    throw new BadRequestError(
      'Schedule time must be at least one minute in the future',
      'BLOG_SCHEDULE_IN_PAST',
    );
  }

  if (!post.title?.trim()) {
    throw new BadRequestError(
      'Add content before publishing',
      'BLOG_CONTENT_REQUIRED',
    );
  }
  assertPublishableContent(post.contentHtml ?? '');

  const updated = await updateBlogPostById(id, {
    status: BlogPostStatus.SCHEDULED,
    publishAt,
    updatedBy: new Types.ObjectId(adminId),
  });
  if (!updated) notFound();
  return toAdminBlogPost(updated);
}

export async function deleteAdminBlogPostService(
  adminId: string,
  id: string,
): Promise<void> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  // Phase 3: files are kept on soft delete (the post can be restored later and the slug stays reserved); unreferenced blog images are a later cleanup job.
  const updated = await updateBlogPostById(id, {
    deletedAt: new Date(),
    status: BlogPostStatus.DRAFT,
    publishAt: null,
    updatedBy: new Types.ObjectId(adminId),
  });
  if (!updated) notFound();
  if (post.status === BlogPostStatus.PUBLISHED) {
    void notifyBlogRevalidate(blogRevalidatePaths({ slug: post.slug }));
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isManagedBlogImageKey(key: string): boolean {
  const root = escapeRegExp(env.R2_ROOT_PREFIX);
  return new RegExp(
    `^${root}/blog/(covers|inline)/[0-9a-f-]{36}\\.webp$`,
  ).test(key);
}

async function deleteBlogImageQuietly(
  key: string | null | undefined,
): Promise<void> {
  if (!key || !isManagedBlogImageKey(key)) return;
  try {
    await createStorageProvider().delete(key, 'public');
  } catch (error) {
    logger.warn('Blog image delete failed', {
      key,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function storeBlogImageService(
  file?: Express.Multer.File,
  target: 'blogInline' | 'blogCover' = 'blogInline',
): Promise<BlogImageUploadResult> {
  if (!file) {
    throw new BadRequestError('Image file is required', 'BLOG_IMAGE_REQUIRED');
  }
  if (detectImageMime(file.buffer) === null) {
    throw new BadRequestError(
      'Only JPEG, PNG, or WebP allowed',
      'BLOG_IMAGE_TYPE_INVALID',
    );
  }

  let optimized: OptimizedImage;
  try {
    optimized = await optimizeImage(file.buffer, 'blog');
  } catch {
    throw new BadRequestError(
      'Image could not be processed',
      'BLOG_IMAGE_INVALID',
    );
  }

  const stored = await createStorageProvider().upload({
    buffer: optimized.buffer,
    mimeType: optimized.mimeType,
    key: mediaKey(target, 'webp'),
    access: 'public',
    cacheControl: 'public, max-age=31536000, immutable',
  });

  return {
    url: stored.url,
    key: stored.key,
    width: optimized.width,
    height: optimized.height,
  };
}

export async function setAdminBlogCoverService(
  adminId: string,
  id: string,
  file?: Express.Multer.File,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  const image = await storeBlogImageService(file, 'blogCover');
  let updated;
  try {
    updated = await updateBlogPostById(id, {
      coverImageUrl: image.url,
      coverImageKey: image.key,
      updatedBy: new Types.ObjectId(adminId),
    });
  } catch (error) {
    await deleteBlogImageQuietly(image.key);
    throw error;
  }
  if (!updated) {
    await deleteBlogImageQuietly(image.key);
    notFound();
  }

  if (post.coverImageKey && post.coverImageKey !== image.key) {
    await deleteBlogImageQuietly(post.coverImageKey);
  }

  if (updated.status === BlogPostStatus.PUBLISHED) {
    void notifyBlogRevalidate(blogRevalidatePaths({ slug: updated.slug }));
  }
  return toAdminBlogPost(updated);
}

export async function removeAdminBlogCoverService(
  adminId: string,
  id: string,
): Promise<AdminBlogPost> {
  const post = await findBlogPostById(id);
  if (!post) notFound();

  const updated = await updateBlogPostById(id, {
    coverImageUrl: null,
    coverImageKey: null,
    updatedBy: new Types.ObjectId(adminId),
  });
  if (!updated) notFound();

  await deleteBlogImageQuietly(post.coverImageKey);
  if (updated.status === BlogPostStatus.PUBLISHED) {
    void notifyBlogRevalidate(blogRevalidatePaths({ slug: updated.slug }));
  }
  return toAdminBlogPost(updated);
}
