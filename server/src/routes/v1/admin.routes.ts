import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { requireAdmin } from '../../middleware/requireAdmin';
import { adminOverviewController } from '../../controllers/admin/adminOverviewController';
import {
  adminPaymentsController,
  adminPaymentsExportController,
} from '../../controllers/admin/adminPaymentsController';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/overview', adminOverviewController);
router.get('/payments/export', adminPaymentsExportController);
router.get('/payments', adminPaymentsController);

export default router;
