import { Router } from 'express';
import { getPublicBlogPostController } from '../../controllers/blog/getPublicBlogPostController';
import { listBlogSitemapController } from '../../controllers/blog/listBlogSitemapController';
import { listPublicBlogPostsController } from '../../controllers/blog/listPublicBlogPostsController';
import { validateRequest } from '../../middleware/validateRequest';
import { blogSlugParamsSchema } from '../../validators/blog/blogSlugParamsSchema';
import { listBlogQuerySchema } from '../../validators/blog/listBlogQuerySchema';

const router = Router();

router.get(
  '/',
  validateRequest({ query: listBlogQuerySchema }),
  listPublicBlogPostsController,
);
// Phase 2 must reserve the slug "sitemap" so no post can ever take it.
router.get('/sitemap', listBlogSitemapController);
router.get(
  '/:slug',
  validateRequest({ params: blogSlugParamsSchema }),
  getPublicBlogPostController,
);

export default router;
