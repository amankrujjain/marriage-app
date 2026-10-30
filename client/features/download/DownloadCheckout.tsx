'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExportFormat, PREMIUM_AMOUNT_INR } from '@marriage/shared';
import { useAppSelector } from '@/store/hooks';
import { useExportBiodata } from '@/features/export/hooks/useExportBiodata';
import { WhatsAppShareButton } from '@/features/export/components/WhatsAppShareButton';
import { slugFromTemplateId } from '@/features/biodata/components/editor/designMap';
import { useDesignCatalog } from '@/features/designs/hooks/useDesignCatalog';
import { DownloadLanguageSelect } from './DownloadLanguageSelect';
import type { DownloadPlan } from './DownloadShell';

type DownloadCheckoutProps = {
  plan: DownloadPlan;
  onPlanChange: (plan: DownloadPlan) => void;
};

export function DownloadCheckout({ plan, onPlanChange }: DownloadCheckoutProps) {
  const router = useRouter();
  const { exportAs, exportDocx } = useExportBiodata();
  const { isFreeDesign, designFromSlug } = useDesignCatalog();
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
  const [preferDocx, setPreferDocx] = useState(false);

  useEffect(() => {
    try {
      setPreferDocx(sessionStorage.getItem('mb_preferred_format') === 'docx');
    } catch {
      setPreferDocx(false);
    }
  }, []);

  const designName =
    designFromSlug(designSlug)?.name ?? slugFromTemplateId(templateId);
  const freeDesign = isFreeDesign(designSlug);
  // Premium plan or Premium design needs Wedding Pass; Free design + Basic does not.
  const needsPass = !isPremium && (plan === 'premium' || !freeDesign);

  const busy =
    exportStatus === 'translating' ||
    exportStatus === 'capturing' ||
    exportStatus === 'exporting' ||
    translationStatus === 'loading';

  function gateDownload(): boolean {
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/download');
      return false;
    }
    if (needsPass) {
      router.push('/wedding-pass');
      return false;
    }
    return true;
  }

  async function onDownloadPdf(): Promise<void> {
    if (!gateDownload()) return;
    await exportAs(ExportFormat.PDF);
  }

  async function onDownloadDocx(): Promise<void> {
    if (!gateDownload()) return;
    await exportDocx();
  }

  async function onDownloadWa(): Promise<void> {
    if (!gateDownload()) return;
    await exportAs(ExportFormat.PNG);
  }

  const busyLabel = (() => {
    if (exportStatus === 'translating' || translationStatus === 'loading') {
      return 'Translating…';
    }
    if (exportStatus === 'capturing') return 'Capturing preview…';
    if (exportStatus === 'exporting') return 'Preparing download…';
    if (busy) return 'Preparing download…';
    return null;
  })();

  const pdfLabel = (() => {
    if (busyLabel) return busyLabel;
    if (authStatus !== 'authenticated') return 'Sign in to download';
    if (needsPass) return 'Continue to Wedding Pass';
    return 'Download PDF';
  })();

  const docxLabel = (() => {
    if (busyLabel) return busyLabel;
    if (authStatus !== 'authenticated') return 'Sign in to download';
    if (needsPass) return 'Continue to Wedding Pass';
    return 'Download Word (.docx)';
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
        className={`btn ${preferDocx ? 'btn-line' : 'btn-primary'} btn-block`}
        type="button"
        disabled={busy}
        onClick={() => void onDownloadPdf()}
        style={{
          marginTop: 16,
          minHeight: preferDocx ? undefined : 54,
          fontSize: preferDocx ? undefined : '1.05rem',
        }}
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
        {pdfLabel}
      </button>

      <button
        className={`btn ${preferDocx ? 'btn-primary' : 'btn-line'} btn-block`}
        type="button"
        disabled={busy}
        onClick={() => void onDownloadDocx()}
        style={{
          marginTop: 10,
          minHeight: preferDocx ? 54 : undefined,
          fontSize: preferDocx ? '1.05rem' : undefined,
        }}
      >
        {docxLabel}
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
      ) : needsPass ? (
        <p className="note" style={{ margin: '10px 0 0' }}>
          {!freeDesign && plan === 'free'
            ? 'This design is Premium. Unlock it with the '
            : 'Unlock premium downloads with the '}
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
