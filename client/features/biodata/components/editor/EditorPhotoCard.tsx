'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProfilePhotoUrl } from '../../store/biodataSlice';
import { uploadBiodataPhoto } from '../../services/biodataApi';

export function EditorPhotoCard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const authStatus = useAppSelector((state) => state.auth.status);
  const photoUrl = useAppSelector((state) => state.biodata.content.profilePhotoUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | null): Promise<void> {
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
    <section className="editor-photo">
      <div
        className="editor-photo-thumb"
        style={
          photoUrl
            ? { backgroundImage: `url(${photoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />
      <div className="editor-photo-copy">
        <b>Photo</b>
        <span>Clear, recent, face visible. We crop it to a 3:4 portrait.</span>
        <div className="editor-photo-actions">
          <button
            type="button"
            className="editor-btn-outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {photoUrl ? 'Change photo' : 'Upload photo'}
          </button>
          {photoUrl ? (
            <button
              type="button"
              className="editor-btn-ghost"
              onClick={() => dispatch(setProfilePhotoUrl(undefined))}
            >
              Biodata without photo
            </button>
          ) : (
            <button type="button" className="editor-btn-ghost" disabled>
              Biodata without photo
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
        />
        {uploading ? <span className="editor-photo-status">Uploading…</span> : null}
        {error ? <span className="editor-photo-error">{error}</span> : null}
      </div>
    </section>
  );
}
