import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { validateRequest } from '../../middleware/validateRequest';
import { adminOverviewController } from '../../controllers/admin/adminOverviewController';
import {
  adminPaymentsController,
  adminPaymentsExportController,
} from '../../controllers/admin/adminPaymentsController';
import {
  adminListTemplatesController,
  adminUpdateTemplateController,
} from '../../controllers/admin/adminTemplatesController';
import {
  adminCreateBlogPostController,
  adminDeleteBlogPostController,
  adminGetBlogPostController,
  adminListBlogPostsController,
  adminPublishBlogPostController,
  adminRemoveBlogCoverController,
  adminScheduleBlogPostController,
  adminScoreBlogPostController,
  adminSetBlogCoverController,
  adminUnpublishBlogPostController,
  adminUpdateBlogPostController,
  adminUploadBlogImageController,
} from '../../controllers/admin/adminBlogController';

import { uploadBlogImageMiddleware } from '../../middleware/uploadBlogImage';
import { blogImageUploadRateLimit } from '../../middleware/rateLimiters';
import {
  templateSlugParamsSchema,
  updateTemplateSchema,
} from '../../validators/admin/updateTemplateSchema';
import {
  blogPostIdParamsSchema,
  createBlogPostSchema,
  listAdminBlogQuerySchema,
  scheduleBlogPostSchema,
  scoreBlogPostSchema,
  updateBlogPostSchema,
} from '../../validators/admin/blogPostSchemas';



const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', adminOverviewController);
router.get('/payments/export', adminPaymentsExportController);
router.get('/payments', adminPaymentsController);
router.get('/templates', adminListTemplatesController);
router.patch(
  '/templates/:slug',
  validateRequest({ params: templateSlugParamsSchema, body: updateTemplateSchema }),
  adminUpdateTemplateController,
);

router.get(
  '/blog',
  validateRequest({ query: listAdminBlogQuerySchema }),
  adminListBlogPostsController,
);
router.post(
  '/blog',
  validateRequest({ body: createBlogPostSchema }),
  adminCreateBlogPostController,
);
router.post(
  '/blog/score',
  validateRequest({ body: scoreBlogPostSchema }),
  adminScoreBlogPostController,
);
router.post(
  '/blog/images',
  blogImageUploadRateLimit,
  uploadBlogImageMiddleware,
  adminUploadBlogImageController,
);
router.post(
  '/blog/:id/cover',
  blogImageUploadRateLimit,
  validateRequest({ params: blogPostIdParamsSchema }),
  uploadBlogImageMiddleware,
  adminSetBlogCoverController,
);
router.delete(
  '/blog/:id/cover',
  validateRequest({ params: blogPostIdParamsSchema }),
  adminRemoveBlogCoverController,
);
router.get(
  '/blog/:id',
  validateRequest({ params: blogPostIdParamsSchema }),
  adminGetBlogPostController,
);
router.patch(
  '/blog/:id',
  validateRequest({ params: blogPostIdParamsSchema, body: updateBlogPostSchema }),
  adminUpdateBlogPostController,
);
router.delete(
  '/blog/:id',
  validateRequest({ params: blogPostIdParamsSchema }),
  adminDeleteBlogPostController,
);
router.post(
  '/blog/:id/publish',
  validateRequest({ params: blogPostIdParamsSchema }),
  adminPublishBlogPostController,
);
router.post(
  '/blog/:id/unpublish',
  validateRequest({ params: blogPostIdParamsSchema }),
  adminUnpublishBlogPostController,
);
router.post(
  '/blog/:id/schedule',
  validateRequest({
    params: blogPostIdParamsSchema,
    body: scheduleBlogPostSchema,
  }),
  adminScheduleBlogPostController,
);

export default router;
