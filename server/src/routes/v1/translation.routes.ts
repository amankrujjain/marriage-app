import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { translationRateLimit } from '../../middleware/translationRateLimit';
import {
  translateBiodataSchema,
  translateFieldsSchema,
} from '../../validators/translation/translateSchema';
import { translateFieldsController } from '../../controllers/translation/translateFieldsController';
import { translateBiodataController } from '../../controllers/translation/translateBiodataController';

const router = Router();

router.use(translationRateLimit);
router.post(
  '/translate',
  validateRequest({ body: translateFieldsSchema }),
  translateFieldsController,
);
router.post(
  '/translate-biodata',
  validateRequest({ body: translateBiodataSchema }),
  translateBiodataController,
);

export default router;
