import { Router } from 'express';
import { registerController } from '../../controllers/auth/registerController';
import { loginController } from '../../controllers/auth/loginController';
import { googleController } from '../../controllers/auth/googleController';
import { meController } from '../../controllers/auth/meController';
import { logoutController } from '../../controllers/auth/logoutController';
import { validateRequest } from '../../middleware/validateRequest';
import { authenticate } from '../../middleware/authenticate';
import { authRateLimit } from '../../middleware/authRateLimit';
import { registerSchema } from '../../validators/auth/registerSchema';
import { loginSchema } from '../../validators/auth/loginSchema';
import { googleAuthSchema } from '../../validators/auth/googleAuthSchema';

const router = Router();

router.use(authRateLimit);
router.post('/register', validateRequest({ body: registerSchema }), registerController);
router.post('/login', validateRequest({ body: loginSchema }), loginController);
router.post('/google', validateRequest({ body: googleAuthSchema }), googleController);
router.post('/logout', logoutController);
router.get('/me', authenticate, meController);

export default router;
