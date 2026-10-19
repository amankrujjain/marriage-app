import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import biodataRoutes from './biodata.routes';
import templatesRoutes from './templates.routes';
import translationRoutes from './translation.routes';
import exportRoutes from './export.routes';
import mediaRoutes from './media.routes';
import cronRoutes from './cron.routes';
import billingRoutes from './billing.routes';
import adminRoutes from './admin.routes';

const v1Router = Router();

v1Router.use('/health', healthRoutes);
v1Router.use('/auth', authRoutes);
v1Router.use('/biodata', biodataRoutes);
v1Router.use('/templates', templatesRoutes);
v1Router.use('/translation', translationRoutes);
v1Router.use('/export', exportRoutes);
v1Router.use('/media', mediaRoutes);
v1Router.use('/billing', billingRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/cron', cronRoutes);

export default v1Router;
