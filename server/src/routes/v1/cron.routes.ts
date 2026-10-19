import { Router } from 'express';
import { cronSecretAuth } from '../../middleware/cronSecretAuth';
import { flushLogsController } from '../../controllers/cron/flushLogsController';
import { reconcilePaymentsController } from '../../controllers/cron/reconcilePaymentsController';

const router = Router();

router.use(cronSecretAuth);
router.post('/flush-logs', flushLogsController);
router.post('/reconcile-payments', reconcilePaymentsController);

export default router;
