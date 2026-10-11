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
  if (!existing || existing.userId.toString() !== userId) {
    throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  }
  await deleteBiodata(id);
}
