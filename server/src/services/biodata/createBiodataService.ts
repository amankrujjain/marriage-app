import type { BiodataRecord, CreateBiodataPayload } from '@marriage/shared';
import { createBiodata } from '../../repositories/biodataRepository';
import { toBiodataRecord } from '../../utils/toBiodataRecord';
import { resolveTitle } from './resolveTitle';

export async function createBiodataService(
  userId: string,
  payload: CreateBiodataPayload,
): Promise<BiodataRecord> {
  const title = resolveTitle(payload.title, payload.content);
  const doc = await createBiodata({
    userId,
    title,
    content: payload.content,
  });
  return toBiodataRecord(doc);
}
