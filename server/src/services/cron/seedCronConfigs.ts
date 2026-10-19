import { env } from '../../config/env';
import { CronConfigModel } from '../../models/CronConfig';
import { logger } from '../../utils/logger';

function defaultConfigs() {
  return [
    {
      key: 'flush-logs',
      name: 'Flush application logs',
      endpoint: '/api/v1/cron/flush-logs',
      method: 'POST' as const,
      /** Every 3 days at 03:00 server time */
      schedule: '0 3 */3 * *',
      enabled: true,
      payload: { retentionDays: env.LOG_RETENTION_DAYS },
      timeoutMs: 60_000,
      description:
        'Deletes Winston daily/weekly log files older than retention. Hit by the in-process cron scheduler.',
    },
    {
      key: 'reconcile-payments',
      name: 'Reconcile pending Wedding Pass payments',
      endpoint: '/api/v1/cron/reconcile-payments',
      method: 'POST' as const,
      /** Every 15 minutes */
      schedule: '*/15 * * * *',
      enabled: true,
      payload: {},
      timeoutMs: 120_000,
      description:
        'Heals stale pending Razorpay orders (fulfil if captured, abandon after grace).',
    },
  ];
}

/** Insert baseline cron endpoint configs if missing (does not overwrite existing rows). */
export async function seedCronConfigs(): Promise<void> {
  for (const item of defaultConfigs()) {
    const existing = await CronConfigModel.findOne({ key: item.key });
    if (existing) continue;
    await CronConfigModel.create(item);
    logger.info('cron.config.seeded', { key: item.key, endpoint: item.endpoint });
  }
}
