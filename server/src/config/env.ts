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
  CLIENT_URL: string;
  CRON_SECRET: string;
  LOG_RETENTION_DAYS: number;
  REDIS_URL?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}

const schema = Joi.object<EnvConfig>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  MONGODB_URI: Joi.string().min(1).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  CLIENT_URL: Joi.string().uri().required(),
  CRON_SECRET: Joi.string().min(16).required(),
  LOG_RETENTION_DAYS: Joi.number().integer().min(1).max(30).default(3),
  REDIS_URL: Joi.string().min(1).allow('').optional(),
  RAZORPAY_KEY_ID: Joi.string().allow('').optional(),
  RAZORPAY_KEY_SECRET: Joi.string().allow('').optional(),
  RAZORPAY_WEBHOOK_SECRET: Joi.string().allow('').optional(),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment: ${error.message}`);
}

export const env: EnvConfig = value;
