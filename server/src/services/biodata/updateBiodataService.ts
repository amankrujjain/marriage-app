import type { BiodataRecord, UpdateBiodataPayload } from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  findBiodataById,
  updateBiodata,
} from '../../repositories/biodataRepository';
import { canonicalizeProfilePhotoUrl } from '../../utils/profilePhotoUrlRule';
import { toBiodataRecord } from '../../utils/toBiodataRecord';
import { resolveTitle } from './resolveTitle';

export async function updateBiodataService(
  userId: string,
  id: string,
  payload: UpdateBiodataPayload,
): Promise<BiodataRecord> {
  const existing = await findBiodataById(id);
  if (!existing || existing.userId.toString() !== userId) {
    throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  }

  const content = payload.content
    ? {
        ...payload.content,
        profilePhotoUrl: canonicalizeProfilePhotoUrl(payload.content.profilePhotoUrl),
      }
    : existing.content;
  const title = payload.title
    ? resolveTitle(payload.title, content)
    : payload.content
      ? resolveTitle(existing.title, content)
      : existing.title;

  const updated = await updateBiodata(id, {
    ...(payload.content ? { content } : {}),
    title,
  });
  if (!updated) throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  return toBiodataRecord(updated);
}
