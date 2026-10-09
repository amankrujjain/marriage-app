import type { BiodataRecord } from '@marriage/shared';
import type { BiodataDocument } from '../models/Biodata';

export function toBiodataRecord(doc: BiodataDocument): BiodataRecord {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
