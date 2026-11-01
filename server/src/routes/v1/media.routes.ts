import { Router } from 'express';
import { serveBlogImageController } from '../../controllers/media/serveBlogImageController';
import { serveMediaController } from '../../controllers/media/serveMediaController';

const router = Router();

router.get('/blog/:fileName', serveBlogImageController);
router.get('/:kind/:fileName', serveMediaController);

export default router;
