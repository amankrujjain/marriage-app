import {
  claimScheduledBlogPost,
  listDueScheduledBlogPosts,
} from '../../repositories/blogPostRepository';
import { logger } from '../../utils/logger';
import {
  blogRevalidatePaths,
  notifyBlogRevalidate,
} from '../blog/notifyRevalidate';

export type PublishScheduledBlogResult = {
  candidates: number;
  published: number;
  skipped: number;
  slugs: string[];
};

export async function publishDueScheduledBlogPosts(): Promise<PublishScheduledBlogResult> {
  const now = new Date();
  const due = await listDueScheduledBlogPosts(now, 50);
  const result: PublishScheduledBlogResult = {
    candidates: due.length,
    published: 0,
    skipped: 0,
    slugs: [],
  };

  for (const post of due) {
    if (!post.publishAt) {
      result.skipped += 1;
      continue;
    }
    const claimed = await claimScheduledBlogPost(
      String(post._id),
      post.publishAt,
    );
    if (!claimed) {
      result.skipped += 1;
      continue;
    }
    result.published += 1;
    result.slugs.push(claimed.slug);
    void notifyBlogRevalidate(blogRevalidatePaths({ slug: claimed.slug }));
  }

  logger.info('cron.publish-scheduled-blog.done', result);
  return result;
}
