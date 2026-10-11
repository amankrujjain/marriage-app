import type {
  BiodataRecord,
  CreateBiodataPayload,
  UpdateBiodataPayload,
} from '@marriage/shared';
import {
  apiDelete,
  apiGet,
  apiGetPaginated,
  apiPatch,
  apiPost,
  apiUpload,
  type PaginatedResult,
} from '@/lib/apiClient';

export async function createBiodata(
  payload: CreateBiodataPayload,
): Promise<BiodataRecord> {
  return apiPost<BiodataRecord>('/biodata', payload);
}

export async function updateBiodata(
  id: string,
  payload: UpdateBiodataPayload,
): Promise<BiodataRecord> {
  return apiPatch<BiodataRecord>(`/biodata/${id}`, payload);
}

export async function fetchBiodata(id: string): Promise<BiodataRecord> {
  return apiGet<BiodataRecord>(`/biodata/${id}`);
}

export async function listBiodata(
  page = 1,
  limit = 20,
): Promise<PaginatedResult<BiodataRecord>> {
  return apiGetPaginated<BiodataRecord>(`/biodata?page=${page}&limit=${limit}`);
}

export async function deleteBiodata(id: string): Promise<void> {
  await apiDelete(`/biodata/${id}`);
}

export async function uploadBiodataPhoto(
  file: File,
): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append('photo', file);
  return apiUpload<{ url: string; key: string }>('/biodata/upload-photo', form);
}
