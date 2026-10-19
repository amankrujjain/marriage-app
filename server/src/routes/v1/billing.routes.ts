import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import {
  checkoutRateLimit,
  requireRedisForBilling,
  verifyRateLimit,
} from '../../middleware/rateLimiters';
import { verifyPaymentSchema } from '../../validators/billing/verifyPaymentSchema';
import { listPlansController } from '../../controllers/billing/plansController';
import { checkoutController } from '../../controllers/billing/checkoutController';
import { verifyPaymentController } from '../../controllers/billing/verifyController';
import { billingMeController } from '../../controllers/billing/billingMeController';

const router = Router();

router.get('/plans', listPlansController);
router.get('/me', authenticate, billingMeController);
router.post(
  '/checkout',
  authenticate,
  requireRedisForBilling,
  checkoutRateLimit,
  checkoutController,
);
router.post(
  '/razorpay/verify',
  authenticate,
  requireRedisForBilling,
  verifyRateLimit,
  validateRequest({ body: verifyPaymentSchema }),
  verifyPaymentController,
);

export default router;
