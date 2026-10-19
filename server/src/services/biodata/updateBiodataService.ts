import {
  mergeSectionsIntoContent,
  type BiodataRecord,
  type UpdateBiodataPayload,
} from '@marriage/shared';
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

  const designSlug =
    payload.designSlug?.trim() ||
    payload.content?.designSlug?.trim() ||
    existing.designSlug ||
    existing.content?.designSlug ||
    undefined;

  const editorSections =
    payload.editorSections !== undefined
      ? payload.editorSections
      : existing.editorSections;

  let content = payload.content
    ? { ...payload.content }
    : { ...existing.content };

  content = mergeSectionsIntoContent(content, editorSections);
  content = {
    ...content,
    profilePhotoUrl: canonicalizeProfilePhotoUrl(content.profilePhotoUrl),
    ...(designSlug ? { designSlug } : {}),
  };

  const title = resolveTitle(
    payload.title !== undefined ? payload.title : existing.title,
    content,
  );

  const updated = await updateBiodata(id, {
    content,
    title,
    designSlug,
    ...(payload.editorSections !== undefined
      ? { editorSections: payload.editorSections }
      : {}),
  });
  if (!updated) throw new NotFoundError('Biodata not found', 'BIODATA_NOT_FOUND');
  return toBiodataRecord(updated);
}
