import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type CronRunStatus = 'passed' | 'failed';

export interface CronLogFields {
  cronConfigId?: Types.ObjectId | null;
  cronKey: string;
  cronName: string;
  endpoint: string;
  method: string;
  status: CronRunStatus;
  payload?: Record<string, unknown> | null;
  response?: {
    statusCode?: number | null;
    body?: unknown;
    error?: string | null;
  } | null;
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const cronLogSchema = new Schema<CronLogFields>(
  {
    cronConfigId: { type: Schema.Types.ObjectId, ref: 'CronConfig', default: null },
    cronKey: { type: String, required: true, index: true },
    cronName: { type: String, required: true },
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    status: { type: String, enum: ['passed', 'failed'], required: true, index: true },
    payload: { type: Schema.Types.Mixed, default: null },
    response: {
      statusCode: { type: Number, default: null },
      body: { type: Schema.Types.Mixed, default: null },
      error: { type: String, default: null },
    },
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date, required: true },
    durationMs: { type: Number, required: true },
  },
  { timestamps: true },
);

cronLogSchema.index({ createdAt: -1 });
cronLogSchema.index({ cronKey: 1, createdAt: -1 });

export type CronLogDocument = HydratedDocument<CronLogFields> & {
  _id: Types.ObjectId;
};

export const CronLogModel = model<CronLogFields>('CronLog', cronLogSchema);
