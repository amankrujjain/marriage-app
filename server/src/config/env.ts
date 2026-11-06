import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config();

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  /** HMAC for legacy /media/exports signed URLs. Falls back to JWT_SECRET if empty. */
  MEDIA_SIGNING_SECRET?: string;
  CLIENT_URL: string;
  CRON_SECRET: string;
  LOG_RETENTION_DAYS: number;
  REDIS_URL?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_SECURE?: boolean;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  MAIL_FROM?: string;
  /** Purchase notify inbox; blank falls back to SMTP_USER. */
  ADMIN_NOTIFY_EMAIL?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_PUBLIC_BUCKET?: string;
  R2_PRIVATE_BUCKET?: string;
  R2_PUBLIC_BASE_URL?: string;
  R2_ROOT_PREFIX: string;
}

const schema = Joi.object<EnvConfig>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  MONGODB_URI: Joi.string().min(1).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  MEDIA_SIGNING_SECRET: Joi.string().min(16).allow('').optional(),
  CLIENT_URL: Joi.string().uri().required(),
  CRON_SECRET: Joi.string().min(16).required(),
  LOG_RETENTION_DAYS: Joi.number().integer().min(1).max(30).default(3),
  REDIS_URL: Joi.string().min(1).allow('').optional(),
  RAZORPAY_KEY_ID: Joi.string().allow('').optional(),
  RAZORPAY_KEY_SECRET: Joi.string().allow('').optional(),
  RAZORPAY_WEBHOOK_SECRET: Joi.string().allow('').optional(),
  SMTP_HOST: Joi.string().allow('').optional(),
  SMTP_PORT: Joi.number().port().optional(),
  SMTP_SECURE: Joi.boolean().truthy('true', '1').falsy('false', '0').optional(),
  SMTP_USER: Joi.string().allow('').optional(),
  SMTP_PASS: Joi.string().allow('').optional(),
  MAIL_FROM: Joi.string().allow('').optional(),
  ADMIN_NOTIFY_EMAIL: Joi.string().email().allow('').optional(),
  R2_ACCOUNT_ID: Joi.string().pattern(/^[a-f0-9]{32}$/).allow('').optional(),
  R2_ACCESS_KEY_ID: Joi.string().allow('').optional(),
  R2_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
  R2_PUBLIC_BUCKET: Joi.string()
    .pattern(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/)
    .allow('')
    .optional(),
  R2_PRIVATE_BUCKET: Joi.string()
    .pattern(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/)
    .allow('')
    .optional(),
  R2_PUBLIC_BASE_URL: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .allow('')
    .optional(),
  R2_ROOT_PREFIX: Joi.string()
    .pattern(/^[a-z0-9_-]+$/)
    .default('marriagebio'),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment: ${error.message}`);
}

export const env: EnvConfig = value;
