import type { BiodataRecord } from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import { findBiodataById } from '../../repositories/biodataRepository';
import { toBiodataRecord } from '../../utils/toBiodataRecord';

export async function getBiodataService(
  userId: string,
  id: string,
): Promise<BiodataRecord> {
  const doc = await findBiodataById(id);
  // Uniform 404 — do not reveal whether another user's biodata id exists.
  if (!doc || doc.userId.toString() !== userId) {
    throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  }
  return toBiodataRecord(doc);
}
