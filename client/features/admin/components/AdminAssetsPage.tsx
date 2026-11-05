'use client';

import { useState } from 'react';
import {
  uploadAdminAsset,
  type AdminAssetUploadResult,
} from '../services/adminApi';

type AssetKind = 'logos' | 'og' | 'misc';

export function AdminAssetsPage() {
  const [kind, setKind] = useState<AssetKind>('og');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AdminAssetUploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Choose a file to upload');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const data = await uploadAdminAsset(file, kind);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function copyUrl() {
    if (!result?.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
    } catch {
      setError('Could not copy URL');
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Assets</h1>
          <p>Upload logos, OG images, or misc files to the public media bucket.</p>
        </div>
      </header>

      <form className="admin-card" onSubmit={(e) => void onUpload(e)}>
        <label className="admin-field">
          <span>Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as AssetKind)}
          >
            <option value="logos">logos</option>
            <option value="og">og</option>
            <option value="misc">misc</option>
          </select>
        </label>
        <label className="admin-field">
          <span>File</span>
          <input
            type="file"
            accept={
              kind === 'logos'
                ? 'image/jpeg,image/png,image/webp,image/svg+xml,.svg'
                : 'image/jpeg,image/png,image/webp'
            }
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
        {error ? <p className="admin-error">{error}</p> : null}
      </form>

      {result ? (
        <div className="admin-card" style={{ marginTop: 16 }}>
          <p>
            <strong>URL</strong>
          </p>
          <p style={{ wordBreak: 'break-all', fontSize: 14 }}>{result.url}</p>
          <button className="btn btn-ghost" type="button" onClick={() => void copyUrl()}>
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted, #666)' }}>
            {result.mimeType} · {result.size} bytes
            {result.width && result.height
              ? ` · ${result.width}×${result.height}`
              : ''}
          </p>
        </div>
      ) : null}
    </div>
  );
}
