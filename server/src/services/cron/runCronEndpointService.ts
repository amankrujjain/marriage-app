import { CronConfigModel, type CronConfigDocument } from '../../models/CronConfig';
import { CronLogModel } from '../../models/CronLog';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

function resolveEndpointUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const base = (process.env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`).replace(
    /\/$/,
    '',
  );
  return `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

function truncateBody(body: unknown, max = 8_000): unknown {
  try {
    const raw = typeof body === 'string' ? body : JSON.stringify(body);
    if (raw.length <= max) {
      return typeof body === 'string' ? body : JSON.parse(raw);
    }
    return `${raw.slice(0, max)}…[truncated]`;
  } catch {
    return '[unserializable]';
  }
}

export async function runCronConfig(config: CronConfigDocument): Promise<void> {
  const startedAt = new Date();
  const url = resolveEndpointUrl(config.endpoint);
  const payload = (config.payload ?? null) as Record<string, unknown> | null;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(config.headers ?? {}),
  };
  if (env.CRON_SECRET) {
    headers['x-cron-secret'] = env.CRON_SECRET;
  }

  const init: RequestInit = {
    method: config.method,
    headers,
    signal: AbortSignal.timeout(config.timeoutMs || 30_000),
  };

  if (payload && config.method !== 'GET' && config.method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(payload);
  }

  let status: 'passed' | 'failed' = 'failed';
  let responseStatus: number | null = null;
  let responseBody: unknown = null;
  let errorMessage: string | null = null;

  try {
    const res = await fetch(url, init);
    responseStatus = res.status;
    const text = await res.text();
    try {
      responseBody = truncateBody(JSON.parse(text));
    } catch {
      responseBody = truncateBody(text);
    }
    status = res.ok ? 'passed' : 'failed';
    if (!res.ok) {
      errorMessage = `HTTP ${res.status}`;
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Cron request failed';
    status = 'failed';
  }

  const finishedAt = new Date();
  const durationMs = finishedAt.getTime() - startedAt.getTime();

  await CronLogModel.create({
    cronConfigId: config._id,
    cronKey: config.key,
    cronName: config.name,
    endpoint: url,
    method: config.method,
    status,
    payload,
    response: {
      statusCode: responseStatus,
      body: responseBody,
      error: errorMessage,
    },
    startedAt,
    finishedAt,
    durationMs,
  });

  if (status === 'passed') {
    logger.info('cron.run.passed', { key: config.key, endpoint: url, durationMs });
  } else {
    logger.error('cron.run.failed', {
      key: config.key,
      endpoint: url,
      durationMs,
      error: errorMessage,
      statusCode: responseStatus,
    });
  }
}

export async function runCronByKey(key: string): Promise<void> {
  const config = await CronConfigModel.findOne({ key, enabled: true });
  if (!config) {
    logger.warn('cron.run.skipped', { key, reason: 'not found or disabled' });
    return;
  }
  await runCronConfig(config);
}
