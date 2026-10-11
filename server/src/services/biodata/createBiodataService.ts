import type { BiodataRecord, CreateBiodataPayload } from '@marriage/shared';
import { createBiodata } from '../../repositories/biodataRepository';
import { canonicalizeProfilePhotoUrl } from '../../utils/profilePhotoUrlRule';
import { toBiodataRecord } from '../../utils/toBiodataRecord';
import { resolveTitle } from './resolveTitle';

export async function createBiodataService(
  userId: string,
  payload: CreateBiodataPayload,
): Promise<BiodataRecord> {
  const content = {
    ...payload.content,
    profilePhotoUrl: canonicalizeProfilePhotoUrl(payload.content.profilePhotoUrl),
  };
  const title = resolveTitle(payload.title, content);
  const doc = await createBiodata({
    userId,
    title,
    content,
  });
  return toBiodataRecord(doc);
}
