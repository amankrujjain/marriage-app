import type { BiodataContent } from '@marriage/shared';
import { BiodataModel, type BiodataDocument } from '../models/Biodata';

export async function createBiodata(input: {
  userId: string;
  title: string;
  content: BiodataContent;
}): Promise<BiodataDocument> {
  return BiodataModel.create(input);
}

export async function findBiodataById(id: string): Promise<BiodataDocument | null> {
  return BiodataModel.findById(id);
}

export async function listBiodataByUser(
  userId: string,
  page: number,
  limit: number,
): Promise<{ items: BiodataDocument[]; total: number }> {
  const filter = { userId };
  const [items, total] = await Promise.all([
    BiodataModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    BiodataModel.countDocuments(filter),
  ]);
  return { items, total };
}

export async function updateBiodata(
  id: string,
  updates: { title?: string; content?: BiodataContent },
): Promise<BiodataDocument | null> {
  return BiodataModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
}

export async function deleteBiodata(id: string): Promise<boolean> {
  const result = await BiodataModel.findByIdAndDelete(id);
  return Boolean(result);
}
