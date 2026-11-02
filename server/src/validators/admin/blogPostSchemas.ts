import Joi from 'joi';
import { BlogPostStatus } from '@marriage/shared';

const slugRule = Joi.string()
  .trim()
  .lowercase()
  .max(200)
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const httpUrl = Joi.string()
  .trim()
  .uri({ scheme: ['http', 'https'] })
  .max(500);

const stripBodyUnknown = { stripUnknown: { objects: true } } as const;

const blogPostBodyFields = {
  title: Joi.string().trim().min(1).max(200),
  slug: slugRule,
  excerpt: Joi.string().trim().max(500).allow(''),
  contentHtml: Joi.string().max(500000).allow(''),
  contentJson: Joi.object().unknown(true).allow(null),
  coverImageUrl: httpUrl.allow(null, ''),
  coverAlt: Joi.string().trim().max(180).allow(''),
  ogImageUrl: httpUrl.allow(null, ''),
  canonicalUrl: httpUrl.allow(null, ''),
  noindex: Joi.boolean(),
  featured: Joi.boolean(),
  tags: Joi.array()
    .items(Joi.string().trim().min(1).max(40))
    .max(12),
  category: Joi.string().trim().max(80).allow(''),
  keywords: Joi.array()
    .items(Joi.string().trim().min(1).max(80))
    .max(20),
  seoTitle: Joi.string().trim().max(120).allow(''),
  seoDescription: Joi.string().trim().max(300).allow(''),
  focusKeyword: Joi.string().trim().max(80).allow(''),
};

export const createBlogPostSchema = Joi.object({
  ...blogPostBodyFields,
  title: blogPostBodyFields.title.required(),
}).options(stripBodyUnknown);

export const updateBlogPostSchema = Joi.object(blogPostBodyFields)
  .min(1)
  .options(stripBodyUnknown);

export const scheduleBlogPostSchema = Joi.object({
  publishAt: Joi.date().iso().required(),
}).options(stripBodyUnknown);

export const blogPostIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listAdminBlogQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(25),
  status: Joi.string().valid(...Object.values(BlogPostStatus)),
  search: Joi.string().trim().max(100).allow(''),
});

/** Preview SEO score — no persistence. */
export const scoreBlogPostSchema = Joi.object({
  title: Joi.string().trim().max(200).allow('').default(''),
  slug: Joi.string().trim().max(200).allow('').default(''),
  excerpt: Joi.string().trim().max(500).allow('').default(''),
  contentHtml: Joi.string().max(500000).allow('').default(''),
  seoTitle: Joi.string().trim().max(120).allow('').default(''),
  seoDescription: Joi.string().trim().max(300).allow('').default(''),
  focusKeyword: Joi.string().trim().max(80).allow('').default(''),
  coverAlt: Joi.string().trim().max(180).allow('').default(''),
}).options(stripBodyUnknown);
