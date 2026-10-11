import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export interface RefreshTokenFields {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenFields>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshTokenDocument = HydratedDocument<RefreshTokenFields> & {
  _id: Types.ObjectId;
};

export const RefreshTokenModel = model<RefreshTokenFields>(
  'RefreshToken',
  refreshTokenSchema,
);
