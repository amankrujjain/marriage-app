import {
  mergeSectionsIntoContent,
  type BiodataRecord,
  type CreateBiodataPayload,
} from '@marriage/shared';
import { createBiodata } from '../../repositories/biodataRepository';
import { canonicalizeProfilePhotoUrl } from '../../utils/profilePhotoUrlRule';
import { toBiodataRecord } from '../../utils/toBiodataRecord';
import { resolveTitle } from './resolveTitle';

export async function createBiodataService(
  userId: string,
  payload: CreateBiodataPayload,
): Promise<BiodataRecord> {
  const designSlug =
    payload.designSlug?.trim() || payload.content.designSlug?.trim() || undefined;
  let content = mergeSectionsIntoContent(payload.content, payload.editorSections);
  content = {
    ...content,
    profilePhotoUrl: canonicalizeProfilePhotoUrl(content.profilePhotoUrl),
    ...(designSlug ? { designSlug } : {}),
  };
  const title = resolveTitle(payload.title, content);
  const doc = await createBiodata({
    userId,
    title,
    content,
    designSlug,
    editorSections: payload.editorSections,
  });
  return toBiodataRecord(doc);
}
