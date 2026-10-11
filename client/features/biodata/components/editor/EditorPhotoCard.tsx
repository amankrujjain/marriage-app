'use client';

import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProfilePhotoFit, setProfilePhotoUrl } from '../../store/biodataSlice';
import { uploadBiodataPhoto } from '../../services/biodataApi';
import { photoFitImgStyle } from '../../utils/photoFit';
import { PhotoAdjuster } from './PhotoAdjuster';
import { DEFAULT_PROFILE_PHOTO_FIT, type ProfilePhotoFit } from '@marriage/shared';

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

  function resetFit(): void {
    dispatch(setProfilePhotoFit({ ...DEFAULT_PROFILE_PHOTO_FIT }));
  }

  return (
    <details className="panel" open>
      <summary>
        <svg
          className="i"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        Photo upload
      </summary>
      <div className="photo-row">
        <div className="photo-box">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Photo preview" style={photoFitImgStyle(photoFit)} />
          ) : null}
        </div>
        <div className="photo-act">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
          />
          <div className="photo-act-btns">
            <button
              className="btn btn-line btn-sm"
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {photoUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {photoUrl ? (
              <button
                className="btn btn-line btn-sm"
                type="button"
                onClick={() => setAdjustOpen(true)}
              >
                Adjust crop
              </button>
            ) : null}
            {photoUrl ? (
              <button className="btn btn-line btn-sm" type="button" onClick={resetFit}>
                Reset crop
              </button>
            ) : null}
          </div>
          {photoUrl ? (
            <button
              className="btn btn-sm"
              type="button"
              style={{
                background: 'none',
                color: 'var(--ink-3)',
                textDecoration: 'underline',
                minHeight: 30,
                padding: 0,
                border: 0,
              }}
              onClick={() => dispatch(setProfilePhotoUrl(undefined))}
            >
              Remove photo
            </button>
          ) : null}
          <span className="note">
            {authStatus !== 'authenticated' && photoUrl
              ? 'Saved on this device until you sign in.'
              : 'Your photo stays on this device. It is only shown in your own browser.'}
          </span>
          {uploading ? <span className="note">Uploading…</span> : null}
        </div>
      </div>
      {error ? (
        <p className="err" role="alert" style={{ padding: '0 18px 12px' }}>
          {error}
        </p>
      ) : null}

      {adjustOpen && photoUrl ? (
        <PhotoAdjuster
          photoUrl={photoUrl}
          initialFit={photoFit}
          onSave={saveFit}
          onClose={() => setAdjustOpen(false)}
        />
      ) : null}
    </details>
  );
}
