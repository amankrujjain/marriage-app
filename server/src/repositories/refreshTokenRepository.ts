import type { Types } from 'mongoose';
import { RefreshTokenModel, type RefreshTokenDocument } from '../models/RefreshToken';

export async function storeRefreshToken(input: {
  userId: Types.ObjectId | string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<RefreshTokenDocument> {
  return RefreshTokenModel.create({
    userId: input.userId,
    tokenHash: input.tokenHash,
    expiresAt: input.expiresAt,
  });
}

export async function findValidRefreshToken(
  tokenHash: string,
): Promise<RefreshTokenDocument | null> {
  return RefreshTokenModel.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
}

export async function findRefreshTokenByHash(
  tokenHash: string,
): Promise<RefreshTokenDocument | null> {
  return RefreshTokenModel.findOne({ tokenHash });
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await RefreshTokenModel.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

export async function revokeAllRefreshTokensForUser(
  userId: Types.ObjectId | string,
): Promise<void> {
  await RefreshTokenModel.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
