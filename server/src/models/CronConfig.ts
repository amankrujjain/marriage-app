import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type CronHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface CronConfigFields {
  /** Stable unique key, e.g. flush-logs */
  key: string;
  name: string;
  /** Absolute or path URL the scheduler will hit, e.g. /api/v1/cron/flush-logs */
  endpoint: string;
  method: CronHttpMethod;
  /** Standard cron expression (node-cron) */
  schedule: string;
  enabled: boolean;
  /** Optional JSON body sent with the request */
  payload?: Record<string, unknown> | null;
  /** Optional extra headers (do not store secrets here in plaintext long-term) */
  headers?: Record<string, string> | null;
  timeoutMs: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const cronConfigSchema = new Schema<CronConfigFields>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    endpoint: { type: String, required: true, trim: true },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'POST',
    },
    schedule: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
    payload: { type: Schema.Types.Mixed, default: null },
    headers: { type: Schema.Types.Mixed, default: null },
    timeoutMs: { type: Number, default: 30_000, min: 1000, max: 300_000 },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export type CronConfigDocument = HydratedDocument<CronConfigFields> & {
  _id: Types.ObjectId;
};

export const CronConfigModel = model<CronConfigFields>('CronConfig', cronConfigSchema);
