'use client';

import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProfilePhotoFit, setProfilePhotoUrl } from '../../store/biodataSlice';
import { uploadBiodataPhoto } from '../../services/biodataApi';
import { photoFitImgStyle } from '../../utils/photoFit';
import { PhotoAdjuster } from './PhotoAdjuster';
import type { ProfilePhotoFit } from '@marriage/shared';

function readLocalDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Could not read photo'));
    reader.readAsDataURL(file);
  });
}

export function EditorPhotoCard() {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const authStatus = useAppSelector((state) => state.auth.status);
  const photoUrl = useAppSelector((state) => state.biodata.content.profilePhotoUrl);
  const photoFit = useAppSelector((state) => state.biodata.content.profilePhotoFit);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  async function onFile(file: File | null): Promise<void> {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      if (authStatus === 'authenticated') {
        const result = await uploadBiodataPhoto(file);
        dispatch(setProfilePhotoUrl(result.url));
      } else {
        const dataUrl = await readLocalDataUrl(file);
        dispatch(setProfilePhotoUrl(dataUrl));
      }
      setAdjustOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function saveFit(fit: ProfilePhotoFit): void {
    dispatch(setProfilePhotoFit(fit));
    setAdjustOpen(false);
  }

  return (
    <section className="editor-photo">
      <div className="editor-photo-thumb">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" style={photoFitImgStyle(photoFit)} />
        ) : null}
      </div>
      <div className="editor-photo-copy">
        <b>Photo</b>
        <span>Clear, recent, face visible. Drag to frame the face in the 3:4 crop.</span>
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
              className="editor-btn-outline"
              onClick={() => setAdjustOpen(true)}
            >
              Adjust crop
            </button>
          ) : null}
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
        {authStatus !== 'authenticated' && photoUrl ? (
          <span className="editor-photo-status">Saved on this device until you sign in</span>
        ) : null}
        {error ? <span className="editor-photo-error">{error}</span> : null}
      </div>

      {adjustOpen && photoUrl ? (
        <PhotoAdjuster
          photoUrl={photoUrl}
          initialFit={photoFit}
          onSave={saveFit}
          onClose={() => setAdjustOpen(false)}
        />
      ) : null}
    </section>
  );
}
