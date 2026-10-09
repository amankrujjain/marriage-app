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
}

const schema = Joi.object<EnvConfig>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(4000),
  MONGODB_URI: Joi.string().min(1).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  CLIENT_URL: Joi.string().uri().required(),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment: ${error.message}`);
}

export const env: EnvConfig = value;
