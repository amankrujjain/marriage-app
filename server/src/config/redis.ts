import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

let client: Redis | null = null;
let ready = false;

export function getRedisClient(): Redis | null {
  if (!env.REDIS_URL) return null;
  if (client) return client;

  client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: true,
    lazyConnect: false,
  });

  client.on('ready', () => {
    ready = true;
    logger.info('redis.ready');
  });
  client.on('error', (err) => {
    ready = false;
    logger.warn('redis.error', { message: err.message });
  });
  client.on('end', () => {
    ready = false;
  });

  return client;
}

export function isRedisReady(): boolean {
  return Boolean(env.REDIS_URL && ready && client);
}

export async function disconnectRedis(): Promise<void> {
  if (!client) return;
  try {
    await client.quit();
  } catch {
    client.disconnect();
  }
  client = null;
  ready = false;
}
