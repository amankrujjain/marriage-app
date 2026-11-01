import { NotFoundError } from '../../errors/NotFoundError';
import {
  deleteBiodata,
  findBiodataById,
  isProfilePhotoInUse,
} from '../../repositories/biodataRepository';
import { parseProfilePhotoKey } from '../../utils/profilePhotoUrlRule';
import { deleteProfilePhotoQuietly } from './uploadPhotoService';

export async function deleteBiodataService(
  userId: string,
  id: string,
): Promise<void> {
  const existing = await findBiodataById(id);
  if (!existing || existing.userId.toString() !== userId) {
    throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  }
  await deleteBiodata(id);

  const oldUrl = existing.content?.profilePhotoUrl;
  if (
    oldUrl &&
    parseProfilePhotoKey(oldUrl) &&
    !(await isProfilePhotoInUse(userId, oldUrl, id))
  ) {
    await deleteProfilePhotoQuietly(oldUrl);
  }
}
