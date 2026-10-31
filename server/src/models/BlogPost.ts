import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import { BlogPostStatus } from '@marriage/shared';

export interface BlogPostFields {
  title: string;
  slug: string;
  previousSlugs: string[];
  excerpt: string;
  /** HOOK phase 2. Stored only after sanitizeBlogHtml runs on write. Public reads trust this field and never sanitize on read. */
  contentHtml: string;
  contentJson: unknown;
  coverImageUrl: string | null;
  /** HOOK phase 3. Storage key for the public, permanent blog image store. This is not the signed photos path; it is used to delete or replace the file. */
  coverImageKey: string | null;
  coverAlt: string;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  featured: boolean;
  tags: string[];
  category: string;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  status: BlogPostStatus;
  /** HOOK phase 6. The scheduled go-live time. The publish job finds status scheduled with publishAt <= now, then sets status published and publishedAt = publishAt using an atomic findOneAndUpdate on { _id, status: scheduled }. */
  publishAt: Date | null;
  publishedAt: Date | null;
  authorId: Types.ObjectId;
  authorName: string;
  updatedBy: Types.ObjectId | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<BlogPostFields>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
      unique: true,
    },
    previousSlugs: { type: [String], default: [], index: true },
    excerpt: { type: String, trim: true, maxlength: 500, default: '' },
    contentHtml: { type: String, default: '' },
    contentJson: { type: Schema.Types.Mixed, default: null },
    coverImageUrl: { type: String, default: null },
    coverImageKey: { type: String, default: null },
    coverAlt: { type: String, trim: true, maxlength: 180, default: '' },
    ogImageUrl: { type: String, default: null },
    canonicalUrl: { type: String, trim: true, default: null },
    noindex: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    category: { type: String, trim: true, maxlength: 80, default: '' },
    keywords: { type: [String], default: [] },
    seoTitle: { type: String, trim: true, maxlength: 120, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 300, default: '' },
    focusKeyword: { type: String, trim: true, maxlength: 80, default: '' },
    status: {
      type: String,
      enum: Object.values(BlogPostStatus),
      default: BlogPostStatus.DRAFT,
      required: true,
    },
    publishAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    authorName: { type: String, trim: true, maxlength: 120, default: '' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, deletedAt: 1, publishedAt: -1 });
blogPostSchema.index({ status: 1, publishAt: 1 });

export type BlogPostDocument = HydratedDocument<BlogPostFields> & {
  _id: Types.ObjectId;
};

export const BlogPostModel = model<BlogPostFields>('BlogPost', blogPostSchema);
