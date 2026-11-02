import { Router } from 'express';
import { cronSecretAuth } from '../../middleware/cronSecretAuth';
import { flushLogsController } from '../../controllers/cron/flushLogsController';
import { publishScheduledBlogController } from '../../controllers/cron/publishScheduledBlogController';
import { reconcilePaymentsController } from '../../controllers/cron/reconcilePaymentsController';

const router = Router();

router.use(cronSecretAuth);
router.post('/flush-logs', flushLogsController);
router.post('/reconcile-payments', reconcilePaymentsController);
router.post('/publish-scheduled-blog', publishScheduledBlogController);

export default router;
