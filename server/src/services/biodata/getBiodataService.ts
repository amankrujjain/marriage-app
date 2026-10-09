import type { BiodataRecord } from '@marriage/shared';
import { ForbiddenError } from '../../errors/ForbiddenError';
import { NotFoundError } from '../../errors/NotFoundError';
import { findBiodataById } from '../../repositories/biodataRepository';
import { toBiodataRecord } from '../../utils/toBiodataRecord';

export async function getBiodataService(
  userId: string,
  id: string,
): Promise<BiodataRecord> {
  const doc = await findBiodataById(id);
  if (!doc) throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  if (doc.userId.toString() !== userId) {
    throw new ForbiddenError('You do not own this biodata');
  }
  return toBiodataRecord(doc);
}
