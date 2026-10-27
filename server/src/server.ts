import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { disconnectRedis } from './config/redis';
import { seedCronConfigs } from './services/cron/seedCronConfigs';
import { ensureDesignTemplatesSeeded } from './services/designs/designTemplateService';
import {
  startCronScheduler,
  stopCronScheduler,
} from './services/cron/startCronScheduler';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await seedCronConfigs();
  await ensureDesignTemplatesSeeded();
  await startCronScheduler();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Shutting down (${signal})`);
    stopCronScheduler();
    server.close(async () => {
      await disconnectRedis();
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error: unknown) => {
  logger.error('Failed to start server', {
    message: error instanceof Error ? error.message : 'Unknown',
  });
  process.exit(1);
});
