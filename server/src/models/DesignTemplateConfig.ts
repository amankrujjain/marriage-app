import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type DesignTier = 'Free' | 'Premium';
export type DesignCategory = 'Traditional' | 'Royal' | 'Floral' | 'Modern';

export interface DesignTemplateConfigFields {
  slug: string;
  name: string;
  tier: DesignTier;
  cat: DesignCategory;
  faith: string[];
  blurb: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const designTemplateConfigSchema = new Schema<DesignTemplateConfigFields>(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    tier: { type: String, enum: ['Free', 'Premium'], required: true, index: true },
    cat: {
      type: String,
      enum: ['Traditional', 'Royal', 'Floral', 'Modern'],
      required: true,
      index: true,
    },
    faith: { type: [String], default: [] },
    blurb: { type: String, default: '' },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type DesignTemplateConfigDocument = HydratedDocument<DesignTemplateConfigFields> & {
  _id: Types.ObjectId;
};

export const DesignTemplateConfigModel = model<DesignTemplateConfigFields>(
  'DesignTemplateConfig',
  designTemplateConfigSchema,
);
