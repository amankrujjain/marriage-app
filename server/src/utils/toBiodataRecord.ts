import type { BiodataRecord } from '@marriage/shared';
import type { BiodataDocument } from '../models/Biodata';
import { signProfilePhotoUrl } from './profilePhotoUrlRule';

export async function toBiodataRecord(
  doc: BiodataDocument,
): Promise<BiodataRecord> {
  const content = { ...doc.content };
  if (content.profilePhotoUrl) {
    content.profilePhotoUrl = await signProfilePhotoUrl(content.profilePhotoUrl);
  }
  const designSlug = doc.designSlug || content.designSlug;
  if (designSlug && !content.designSlug) {
    content.designSlug = designSlug;
  }
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    title: doc.title,
    content,
    designSlug,
    editorSections: Array.isArray(doc.editorSections)
      ? doc.editorSections
      : undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
