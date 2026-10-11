import { Router } from 'express';
import { serveMediaController } from '../../controllers/media/serveMediaController';

const router = Router();

router.get('/:kind/:fileName', serveMediaController);

export default router;
