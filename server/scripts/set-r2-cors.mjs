/**
 * Apply CORS on R2 private (+ public) buckets so browser canvas capture can
 * load signed photos with crossOrigin=anonymous.
 *
 * Run from server/: node scripts/set-r2-cors.mjs
 */
import {
  PutBucketCorsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const privateBucket = process.env.R2_PRIVATE_BUCKET;
const publicBucket = process.env.R2_PUBLIC_BUCKET;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

if (!accountId || !accessKeyId || !secretAccessKey || !privateBucket) {
  console.error('Missing R2 env (ACCOUNT_ID / keys / PRIVATE_BUCKET)');
  process.exit(1);
}

const origins = Array.from(
  new Set([
    clientUrl.replace(/\/$/, ''),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://marriagebio.in',
    'https://www.marriagebio.in',
  ]),
);

const CORSConfiguration = {
  CORSRules: [
    {
      AllowedOrigins: origins,
      AllowedMethods: ['GET', 'HEAD'],
      AllowedHeaders: ['*'],
      ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
      MaxAgeSeconds: 3600,
    },
  ],
};

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

async function apply(bucket) {
  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration,
    }),
  );
  console.log(`CORS set on ${bucket}:`, origins.join(', '));
}

await apply(privateBucket);
if (publicBucket) await apply(publicBucket);
console.log('Done. Wait ~30s, hard-refresh the download page, then export again.');
