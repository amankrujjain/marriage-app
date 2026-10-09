import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const email = `export.${Date.now()}@example.com`;
const tinyPng =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

async function main() {
  const reg = await fetch(`${api}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Export User',
      email,
      password: 'password123',
    }),
  }).then((r) => r.json());

  const token = reg.data.accessToken;
  const payload = {
    format: 'png',
    imageBase64: `data:image/png;base64,${tinyPng}`,
    fileName: 'Test',
    personName: 'Test',
  };

  const denied = await fetch(`${api}/export`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
  console.log('NON_PREMIUM', denied.error?.code);

  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.collection('users').updateOne(
    { email },
    { $set: { premiumUntil: new Date(Date.now() + 30 * 864e5) } },
  );
  await mongoose.disconnect();

  const allowed = await fetch(`${api}/export`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());
  console.log('PREMIUM', allowed.success, allowed.data?.format, allowed.data?.url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
