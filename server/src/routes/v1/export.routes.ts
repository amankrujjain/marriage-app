import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import { exportSchema } from '../../validators/export/exportSchema';
import { documentExportSchema } from '../../validators/export/documentExportSchema';
import { exportController } from '../../controllers/export/exportController';
import { documentExportController } from '../../controllers/export/documentExportController';

const router = Router();

router.post('/', authenticate, validateRequest({ body: exportSchema }), exportController);
router.post(
  '/document',
  authenticate,
  validateRequest({ body: documentExportSchema }),
  documentExportController,
);

export default router;
