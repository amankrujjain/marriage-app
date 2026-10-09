import { Router } from 'express';
import { getHealth } from '../../controllers/healthController';
import { validateRequest } from '../../middleware/validateRequest';
import { healthQuerySchema } from '../../validators/healthQuerySchema';

const router = Router();

router.get('/', validateRequest({ query: healthQuerySchema }), getHealth);

export default router;
