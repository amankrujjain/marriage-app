'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExportFormat, PREMIUM_AMOUNT_INR } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { useExportBiodata } from '@/features/export/hooks/useExportBiodata';
import { WhatsAppShareButton } from '@/features/export/components/WhatsAppShareButton';
import { designFromSlug, slugFromTemplateId } from '@/features/biodata/components/editor/designMap';
import { DownloadLanguageSelect } from './DownloadLanguageSelect';
import type { DownloadPlan } from './DownloadShell';

type DownloadCheckoutProps = {
  plan: DownloadPlan;
  onPlanChange: (plan: DownloadPlan) => void;
};

export function DownloadCheckout({ plan, onPlanChange }: DownloadCheckoutProps) {
  const router = useRouter();
  const { exportAs } = useExportBiodata();
  const isPremium = useAppSelector((state) => state.auth.user?.isPremium ?? false);
  const premiumUntil = useAppSelector((state) => state.auth.user?.premiumUntil);
  const authStatus = useAppSelector((state) => state.auth.status);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const designSlug = useAppSelector(
    (state) =>
      state.template.selectedDesignSlug || slugFromTemplateId(state.template.selectedTemplateId),
  );
  const exportStatus = useAppSelector((state) => state.export.status);
  const exportError = useAppSelector((state) => state.export.error);
  const result = useAppSelector((state) => state.export.result);
  const translationStatus = useAppSelector((state) => state.language.status);
  const translationError = useAppSelector((state) => state.language.error);

  const designName =
    designFromSlug(designSlug)?.name ?? slugFromTemplateId(templateId);

  const busy =
    exportStatus === 'translating' ||
    exportStatus === 'capturing' ||
    exportStatus === 'exporting' ||
    translationStatus === 'loading';

  async function onDownloadPdf(): Promise<void> {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/download');
      return;
    }

    if (plan === 'premium' && !isPremium) {
      router.push('/wedding-pass');
      return;
    }

    await exportAs(ExportFormat.PDF);
  }

  async function onDownloadWa(): Promise<void> {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/download');
      return;
    }
    if (plan === 'premium' && !isPremium) {
      router.push('/wedding-pass');
      return;
    }
    await exportAs(ExportFormat.PNG);
  }

  const primaryLabel = (() => {
    if (exportStatus === 'translating' || translationStatus === 'loading') {
      return 'Translating…';
    }
    if (exportStatus === 'capturing') return 'Capturing preview…';
    if (exportStatus === 'exporting') return 'Preparing download…';
    if (busy) return 'Preparing download…';
    if (authStatus !== 'authenticated') return 'Sign in to download';
    if (plan === 'premium' && !isPremium) return 'Continue to Wedding Pass';
    return 'Download PDF';
  })();

  const premiumPriceLabel = isPremium ? 'Included' : `₹${PREMIUM_AMOUNT_INR}`;

  return (
    <div className="card">
      <h3>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
        </svg>
        Choose your download
      </h3>

      {isPremium ? (
        <div className="info" style={{ marginTop: 12, marginBottom: 4 }}>
          <span className="badge prem">Wedding Pass active</span>
          <span style={{ marginLeft: 8 }}>
            Premium downloads unlocked
            {premiumUntil
              ? ` until ${new Date(premiumUntil).toLocaleDateString()}`
              : ''}
            . No extra payment.
          </span>
        </div>
      ) : null}

      <DownloadLanguageSelect disabled={busy} />

      <fieldset style={{ border: 0, padding: 0, margin: '14px 0 0' }}>
        <legend className="fld" style={{ padding: 0, fontWeight: 700 }}>
          Select format &amp; quality
        </legend>
        <label className={`opt${isPremium ? ' pass-owned' : ''}`}>
          <input
            type="radio"
            name="q"
            value="premium"
            checked={plan === 'premium'}
            onChange={() => onPlanChange('premium')}
          />
          <span>
            <b>
              {designName.split(' ')[0]} Premium
              {isPremium ? ' · Your Pass' : ''}
            </b>
            <small>
              {isPremium
                ? 'High quality · A4 · Print ready · no credit line · already unlocked'
                : 'High quality · A4 size · Print ready · no credit line'}
            </small>
          </span>
          <span className={`pr${isPremium ? ' included' : ''}`}>{premiumPriceLabel}</span>
        </label>
        <label className="opt">
          <input
            type="radio"
            name="q"
            value="basic"
            checked={plan === 'free'}
            onChange={() => onPlanChange('free')}
          />
          <span>
            <b>Basic (Free)</b>
            <small>Standard quality · A4 size · PDF with credit line</small>
          </span>
          <span className="pr">₹0</span>
        </label>
      </fieldset>

      <div className="info" style={{ marginTop: 12 }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
          style={{ flex: 'none' }}
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
        <span>Note: Field labels will stay in English even if you choose another language.</span>
      </div>

      <button
        className="btn btn-primary btn-block"
        type="button"
        disabled={busy}
        onClick={() => void onDownloadPdf()}
        style={{ marginTop: 16, minHeight: 54, fontSize: '1.05rem' }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
        </svg>
        {primaryLabel}
      </button>

      <button
        className="btn btn-line btn-block"
        type="button"
        disabled={busy}
        onClick={() => void onDownloadWa()}
        style={{ marginTop: 10 }}
      >
        Download WhatsApp image
      </button>

      {authStatus !== 'authenticated' ? (
        <p className="note" style={{ margin: '10px 0 0' }}>
          You can design freely as a guest. Sign in when you&apos;re ready to download.
        </p>
      ) : plan === 'premium' && !isPremium ? (
        <p className="note" style={{ margin: '10px 0 0' }}>
          Unlock premium downloads with the{' '}
          <Link href="/wedding-pass">Wedding Pass</Link> (₹{PREMIUM_AMOUNT_INR} for 30 days).
        </p>
      ) : (
        <p className="note" style={{ margin: '10px 0 0' }}>
          Downloads start on this device. You can re-open the file anytime.
        </p>
      )}

      {translationError ? (
        <p
          className={translationStatus === 'ready' ? 'note' : 'err'}
          style={{ marginTop: 10 }}
          role="status"
        >
          {translationError}
        </p>
      ) : null}
      {exportError ? (
        <p className="err" style={{ marginTop: 10 }}>
          {exportError}
        </p>
      ) : null}

      {result ? (
        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
          <a href={result.url} download={result.fileName} className="btn btn-line btn-block">
            Open {result.format.toUpperCase()} file
          </a>
          <WhatsAppShareButton />
        </div>
      ) : null}
    </div>
  );
}
