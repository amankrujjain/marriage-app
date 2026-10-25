import { Router } from 'express';
import { listDesignsController } from '../../controllers/designs/listDesignsController';

const router = Router();

router.get('/', listDesignsController);

export default router;
