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
  templateSlugParamsSchema,
  updateTemplateSchema,
} from '../../validators/admin/updateTemplateSchema';

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

export default router;
