import type { BiodataRecord } from '@marriage/shared';
import type { BiodataDocument } from '../models/Biodata';
import { resignMediaUrlIfNeeded } from './signedMediaUrl';

const PHOTO_URL_TTL_SEC = 7 * 24 * 60 * 60;

export function toBiodataRecord(doc: BiodataDocument): BiodataRecord {
  const content = { ...doc.content };
  if (content.profilePhotoUrl) {
    content.profilePhotoUrl =
      resignMediaUrlIfNeeded(content.profilePhotoUrl, PHOTO_URL_TTL_SEC) ??
      content.profilePhotoUrl;
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
    editorSections: Array.isArray(doc.editorSections) ? doc.editorSections : undefined,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
