import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import { exportSchema } from '../../validators/export/exportSchema';
import { exportController } from '../../controllers/export/exportController';

const router = Router();

router.post('/', authenticate, validateRequest({ body: exportSchema }), exportController);

export default router;
