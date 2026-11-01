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
  const photo = canonicalizeProfilePhotoUrl(content.profilePhotoUrl, userId);
  content = {
    ...content,
    ...(designSlug ? { designSlug } : {}),
  };
  if (photo !== undefined) {
    content.profilePhotoUrl = photo;
  } else {
    delete content.profilePhotoUrl;
  }
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
