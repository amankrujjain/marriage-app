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
  adminScheduleBlogPostController,
  adminUnpublishBlogPostController,
  adminUpdateBlogPostController,
} from '../../controllers/admin/adminBlogController';
import {
  templateSlugParamsSchema,
  updateTemplateSchema,
} from '../../validators/admin/updateTemplateSchema';
import {
  blogPostIdParamsSchema,
  createBlogPostSchema,
  listAdminBlogQuerySchema,
  scheduleBlogPostSchema,
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
