import type {
  BiodataRecord,
  CreateBiodataPayload,
  UpdateBiodataPayload,
} from '@marriage/shared';
import { apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { getAccessToken } from '@/lib/tokenStorage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

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

export async function uploadBiodataPhoto(
  file: File,
): Promise<{ url: string; key: string }> {
  const form = new FormData();
  form.append('photo', file);
  const token = getAccessToken();
  const response = await fetch(`${API_BASE}/biodata/upload-photo`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message ?? 'Upload failed');
  }
  return json.data as { url: string; key: string };
}
