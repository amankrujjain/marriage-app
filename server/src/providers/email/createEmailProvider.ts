import { mailConfig } from '../../config/mailEnv';
import type { EmailProvider } from './EmailProvider';
import { NodemailerEmailProvider } from './NodemailerEmailProvider';

let cached: EmailProvider | null = null;

export function createEmailProvider(): EmailProvider | null {
  if (!mailConfig.configured) return null;
  if (!cached) cached = new NodemailerEmailProvider();
  return cached;
}
