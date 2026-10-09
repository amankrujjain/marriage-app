import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import { uploadPhotoMiddleware } from '../../middleware/uploadPhoto';
import { createBiodataSchema } from '../../validators/biodata/createBiodataSchema';
import { updateBiodataSchema } from '../../validators/biodata/updateBiodataSchema';
import { biodataIdSchema } from '../../validators/biodata/biodataIdSchema';
import { listBiodataQuerySchema } from '../../validators/biodata/listBiodataQuerySchema';
import { createBiodataController } from '../../controllers/biodata/createBiodataController';
import { listBiodataController } from '../../controllers/biodata/listBiodataController';
import { getBiodataController } from '../../controllers/biodata/getBiodataController';
import { updateBiodataController } from '../../controllers/biodata/updateBiodataController';
import { deleteBiodataController } from '../../controllers/biodata/deleteBiodataController';
import { uploadPhotoController } from '../../controllers/biodata/uploadPhotoController';

const router = Router();

router.use(authenticate);
router.post('/', validateRequest({ body: createBiodataSchema }), createBiodataController);
router.get('/', validateRequest({ query: listBiodataQuerySchema }), listBiodataController);
router.post('/upload-photo', uploadPhotoMiddleware, uploadPhotoController);
router.get('/:id', validateRequest({ params: biodataIdSchema }), getBiodataController);
router.patch(
  '/:id',
  validateRequest({ params: biodataIdSchema, body: updateBiodataSchema }),
  updateBiodataController,
);
router.delete(
  '/:id',
  validateRequest({ params: biodataIdSchema }),
  deleteBiodataController,
);

export default router;
