import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { serveMediaController } from '../../controllers/media/serveMediaController';
import { proxyProfilePhotoController } from '../../controllers/media/proxyProfilePhotoController';

const router = Router();

router.get('/profile-photo', authenticate, proxyProfilePhotoController);
router.get('/:kind/:fileName', serveMediaController);

export default router;
