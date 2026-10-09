import { isDatabaseConnected } from '../config/database';

export interface HealthStatus {
  status: 'ok' | 'degraded';
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export function getHealthStatus(deep: boolean): HealthStatus {
  const database = isDatabaseConnected() ? 'connected' : 'disconnected';
  const status = !deep || database === 'connected' ? 'ok' : 'degraded';

  return {
    status,
    database,
    timestamp: new Date().toISOString(),
  };
}
