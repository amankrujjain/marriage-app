import {
  mergeSectionsIntoContent,
  type BiodataRecord,
  type UpdateBiodataPayload,
} from '@marriage/shared';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  findBiodataById,
  isProfilePhotoInUse,
  updateBiodata,
} from '../../repositories/biodataRepository';
import {
  canonicalizeProfilePhotoUrl,
  parseProfilePhotoKey,
} from '../../utils/profilePhotoUrlRule';
import { toBiodataRecord } from '../../utils/toBiodataRecord';
import { resolveTitle } from './resolveTitle';
import { deleteProfilePhotoQuietly } from './uploadPhotoService';

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

  const incoming = content.profilePhotoUrl;
  let next = canonicalizeProfilePhotoUrl(incoming, userId);
  if (incoming && next === undefined) {
    next = existing.content?.profilePhotoUrl;
  }
  content = {
    ...content,
    profilePhotoUrl: next,
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

  const oldUrl = existing.content?.profilePhotoUrl;
  const newUrl = updated.content?.profilePhotoUrl;
  if (
    oldUrl &&
    parseProfilePhotoKey(oldUrl) &&
    oldUrl !== newUrl &&
    !(await isProfilePhotoInUse(userId, oldUrl, id))
  ) {
    await deleteProfilePhotoQuietly(oldUrl);
  }

  return toBiodataRecord(updated);
}
