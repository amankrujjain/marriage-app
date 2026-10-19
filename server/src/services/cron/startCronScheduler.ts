import cron, { type ScheduledTask } from 'node-cron';
import { CronConfigModel } from '../../models/CronConfig';
import { logger } from '../../utils/logger';
import { runCronByKey } from './runCronEndpointService';

const tasks = new Map<string, ScheduledTask>();

export async function startCronScheduler(): Promise<void> {
  stopCronScheduler();

  const configs = await CronConfigModel.find({ enabled: true }).lean();
  for (const config of configs) {
    if (!cron.validate(config.schedule)) {
      logger.error('cron.schedule.invalid', {
        key: config.key,
        schedule: config.schedule,
      });
      continue;
    }

    const key = config.key;
    const task = cron.schedule(config.schedule, () => {
      void runCronByKey(key).catch((err: unknown) => {
        logger.error('cron.schedule.unhandled', {
          key,
          message: err instanceof Error ? err.message : 'Unknown',
        });
      });
    });

    tasks.set(key, task);
    logger.info('cron.schedule.registered', {
      key,
      schedule: config.schedule,
      endpoint: config.endpoint,
    });
  }
}

export function stopCronScheduler(): void {
  for (const [key, task] of tasks) {
    task.stop();
    tasks.delete(key);
  }
}
