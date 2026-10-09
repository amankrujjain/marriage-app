'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProfilePhotoUrl } from '../../store/biodataSlice';
import { uploadBiodataPhoto } from '../../services/biodataApi';

export function PhotoStep() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authStatus = useAppSelector((state) => state.auth.status);
  const photoUrl = useAppSelector((state) => state.biodata.content.profilePhotoUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(file: File | null): Promise<void> {
    if (!file) return;
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/marriage-biodata-maker');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const result = await uploadBiodataPhoto(file);
      dispatch(setProfilePhotoUrl(result.url));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-body text-ink/75">
        Upload a clear profile photo (JPEG, PNG, or WebP, max 2MB).
      </p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="font-body text-sm"
        onChange={(event) => void onFileChange(event.target.files?.[0] ?? null)}
      />
      {uploading ? <p className="text-sm text-ink/60">Uploading…</p> : null}
      {error ? <p className="text-sm text-maroon">{error}</p> : null}
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt="Profile preview"
          className="mt-2 h-40 w-40 object-cover ring-1 ring-gold"
        />
      ) : null}
    </div>
  );
}
