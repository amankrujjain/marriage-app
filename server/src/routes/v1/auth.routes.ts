import { Router } from 'express';
import { registerController } from '../../controllers/auth/registerController';
import { loginController } from '../../controllers/auth/loginController';
import { googleController } from '../../controllers/auth/googleController';
import { meController } from '../../controllers/auth/meController';
import { logoutController } from '../../controllers/auth/logoutController';
import { refreshController } from '../../controllers/auth/refreshController';
import { forgotPasswordController } from '../../controllers/auth/forgotPasswordController';
import { resetPasswordController } from '../../controllers/auth/resetPasswordController';
import { validateRequest } from '../../middleware/validateRequest';
import { authenticate } from '../../middleware/authenticate';
import { authRateLimit } from '../../middleware/authRateLimit';
import { registerSchema } from '../../validators/auth/registerSchema';
import { loginSchema } from '../../validators/auth/loginSchema';
import { googleAuthSchema } from '../../validators/auth/googleAuthSchema';
import { forgotPasswordSchema } from '../../validators/auth/forgotPasswordSchema';
import { resetPasswordSchema } from '../../validators/auth/resetPasswordSchema';

const router = Router();

// Strict limit only on credential / token-exchange routes.
// Do NOT share this bucket with /me, /refresh, /logout — page loads burn it instantly.
router.post(
  '/register',
  authRateLimit,
  validateRequest({ body: registerSchema }),
  registerController,
);
router.post(
  '/login',
  authRateLimit,
  validateRequest({ body: loginSchema }),
  loginController,
);
router.post(
  '/google',
  authRateLimit,
  validateRequest({ body: googleAuthSchema }),
  googleController,
);
router.post(
  '/forgot-password',
  authRateLimit,
  validateRequest({ body: forgotPasswordSchema }),
  forgotPasswordController,
);
router.post(
  '/reset-password',
  authRateLimit,
  validateRequest({ body: resetPasswordSchema }),
  resetPasswordController,
);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.get('/me', authenticate, meController);

export default router;
