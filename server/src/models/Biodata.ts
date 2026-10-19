import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import type { BiodataContent, BiodataEditorSection } from '@marriage/shared';

export interface BiodataFields {
  userId: Types.ObjectId;
  title: string;
  content: BiodataContent;
  designSlug?: string;
  editorSections?: BiodataEditorSection[];
  createdAt: Date;
  updatedAt: Date;
}

const biodataSchema = new Schema<BiodataFields>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: Schema.Types.Mixed, required: true },
    designSlug: { type: String, trim: true, index: true },
    editorSections: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type BiodataDocument = HydratedDocument<BiodataFields> & {
  _id: Types.ObjectId;
};

export const BiodataModel = model<BiodataFields>('Biodata', biodataSchema);
