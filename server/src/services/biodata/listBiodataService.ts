import type { BiodataRecord } from '@marriage/shared';
import { listBiodataByUser } from '../../repositories/biodataRepository';
import { toBiodataRecord } from '../../utils/toBiodataRecord';

export async function listBiodataService(
  userId: string,
  page: number,
  limit: number,
): Promise<{ items: BiodataRecord[]; total: number }> {
  const { items, total } = await listBiodataByUser(userId, page, limit);
  return { items: items.map(toBiodataRecord), total };
}
