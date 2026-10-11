'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExportFormat, PREMIUM_AMOUNT_INR, TemplateId } from '@marriage/shared';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectTemplate } from '@/features/templates/store/templateSlice';
import { useExportBiodata } from '@/features/export/hooks/useExportBiodata';
import { WhatsAppShareButton } from '@/features/export/components/WhatsAppShareButton';
import { designKeyFromTemplate, EDITOR_DESIGNS } from '@/features/biodata/components/editor/designMap';
import { DownloadLanguageSelect } from './DownloadLanguageSelect';

type Plan = 'premium' | 'free';

export function DownloadCheckout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { exportAs } = useExportBiodata();
  const isPremium = useAppSelector((state) => state.auth.user?.isPremium ?? false);
  const authStatus = useAppSelector((state) => state.auth.status);
  const templateId = useAppSelector((state) => state.template.selectedTemplateId);
  const exportStatus = useAppSelector((state) => state.export.status);
  const exportError = useAppSelector((state) => state.export.error);
  const result = useAppSelector((state) => state.export.result);
  const translationStatus = useAppSelector((state) => state.language.status);
  const translationError = useAppSelector((state) => state.language.error);
  const [plan, setPlan] = useState<Plan>(isPremium ? 'premium' : 'premium');

  const designName =
    EDITOR_DESIGNS.find((d) => d.templateId === templateId)?.name ??
    designKeyFromTemplate(templateId);

  const busy =
    exportStatus === 'translating' ||
    exportStatus === 'capturing' ||
    exportStatus === 'exporting' ||
    translationStatus === 'loading';

  async function onPrimary(): Promise<void> {
    // Guest: full journey is allowed until export — then require login
    if (authStatus !== 'authenticated') {
      router.push('/login?next=/download');
      return;
    }

    if (plan === 'free') {
      dispatch(selectTemplate(TemplateId.MODERN_CLEAN));
      // Let the A4 preview re-render on Kagaz before capture
      await new Promise((resolve) => setTimeout(resolve, 120));
      await exportAs(ExportFormat.PDF);
      return;
    }

    if (!isPremium) {
      // Payment integration comes later
      router.push('/wedding-pass');
      return;
    }

    await exportAs(ExportFormat.PDF);
  }

  const primaryLabel = (() => {
    if (exportStatus === 'translating' || translationStatus === 'loading') {
      return 'Translating…';
    }
    if (exportStatus === 'capturing') return 'Capturing preview…';
    if (exportStatus === 'exporting') return 'Preparing download…';
    if (busy) return 'Preparing download…';
    if (authStatus !== 'authenticated') return 'Sign in to download';
    if (plan === 'free') return 'Download free PDF';
    if (isPremium) return 'Download PDF & image';
    return 'Continue to Wedding Pass';
  })();

  return (
    <div className="dl-card">
      <b>Choose your download</b>

      <DownloadLanguageSelect disabled={busy} />

      <label className={`dl-plan ${plan === 'premium' ? 'is-active' : ''}`}>
        <input
          type="radio"
          name="plan"
          checked={plan === 'premium'}
          onChange={() => setPlan('premium')}
        />
        <span className="dl-plan-body">
          <span className="dl-plan-top">
            <b>
              {designName} · Premium
            </b>
            <b>₹{PREMIUM_AMOUNT_INR}</b>
          </span>
          <span className="dl-plan-desc">
            PDF + WhatsApp image · no credit line · free re-downloads after edits
          </span>
        </span>
      </label>

      <label className={`dl-plan ${plan === 'free' ? 'is-active' : ''}`}>
        <input
          type="radio"
          name="plan"
          checked={plan === 'free'}
          onChange={() => setPlan('free')}
        />
        <span className="dl-plan-body">
          <span className="dl-plan-top">
            <b>Switch to a free design</b>
            <b>₹0</b>
          </span>
          <span className="dl-plan-desc">Kagaz · PDF with a small footer credit</span>
        </span>
      </label>

      <button
        type="button"
        className="dl-pay-btn"
        disabled={busy}
        onClick={() => void onPrimary()}
      >
        {primaryLabel}
      </button>

      {authStatus !== 'authenticated' ? (
        <span className="dl-pay-note">
          You can design freely as a guest. Sign in when you&apos;re ready to download.
        </span>
      ) : plan === 'premium' && !isPremium ? (
        <span className="dl-pay-note">
          Payment comes next. For now continue via{' '}
          <Link href="/wedding-pass">Wedding Pass</Link> (UPI integration later).
        </span>
      ) : (
        <span className="dl-pay-note">
          Downloads start on this device. You can re-open the file anytime.
        </span>
      )}

      {translationError ? <p className="dl-error">{translationError}</p> : null}
      {exportError ? <p className="dl-error">{exportError}</p> : null}

      {result ? (
        <div className="dl-result">
          <a href={result.url} download={result.fileName} className="dl-result-link">
            Open {result.format.toUpperCase()} file
          </a>
          <button
            type="button"
            className="dl-secondary-btn"
            disabled={busy}
            onClick={() => void exportAs(ExportFormat.PNG)}
          >
            Also download WhatsApp image (PNG)
          </button>
          <WhatsAppShareButton />
        </div>
      ) : null}
    </div>
  );
}
