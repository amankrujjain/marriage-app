import { Router } from 'express';
import { cronSecretAuth } from '../../middleware/cronSecretAuth';
import { flushLogsController } from '../../controllers/cron/flushLogsController';

const router = Router();

router.use(cronSecretAuth);
router.post('/flush-logs', flushLogsController);

export default router;
