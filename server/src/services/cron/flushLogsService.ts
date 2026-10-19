import fs from 'fs/promises';
import path from 'path';
import { getLogDirectory } from '../../utils/logger';

export type FlushLogsResult = {
  retentionDays: number;
  logDir: string;
  deleted: string[];
  kept: string[];
};

/**
 * Delete rotated log files whose mtime is older than retentionDays (default 3).
 */
export async function flushOldLogFiles(
  retentionDays = 3,
): Promise<FlushLogsResult> {
  const days = Number.isFinite(retentionDays) && retentionDays > 0 ? retentionDays : 3;
  const logDir = getLogDirectory();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  let entries: string[] = [];
  try {
    entries = await fs.readdir(logDir);
  } catch {
    return { retentionDays: days, logDir, deleted: [], kept: [] };
  }

  const deleted: string[] = [];
  const kept: string[] = [];

  for (const name of entries) {
    if (!name.endsWith('.log') && !name.endsWith('.log.gz')) {
      continue;
    }
    const full = path.join(logDir, name);
    try {
      const stat = await fs.stat(full);
      if (!stat.isFile()) continue;
      if (stat.mtimeMs < cutoff) {
        await fs.unlink(full);
        deleted.push(name);
      } else {
        kept.push(name);
      }
    } catch {
      /* skip unreadable entries */
    }
  }

  return { retentionDays: days, logDir, deleted, kept };
}
