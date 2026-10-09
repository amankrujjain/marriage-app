import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { templateIdSchema } from '../../validators/templates/templateIdSchema';
import { listTemplatesController } from '../../controllers/templates/listTemplatesController';
import { getTemplateController } from '../../controllers/templates/getTemplateController';

const router = Router();

router.get('/', listTemplatesController);
router.get('/:id', validateRequest({ params: templateIdSchema }), getTemplateController);

export default router;
