import { ForbiddenError } from '../../errors/ForbiddenError';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  deleteBiodata,
  findBiodataById,
} from '../../repositories/biodataRepository';

export async function deleteBiodataService(
  userId: string,
  id: string,
): Promise<void> {
  const existing = await findBiodataById(id);
  if (!existing) throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  if (existing.userId.toString() !== userId) {
    throw new ForbiddenError('You do not own this biodata');
  }
  await deleteBiodata(id);
}
