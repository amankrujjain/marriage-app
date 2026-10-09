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
  const [plan, setPlan] = useState<Plan>(isPremium ? 'premium' : 'premium');

  const designName =
    EDITOR_DESIGNS.find((d) => d.templateId === templateId)?.name ??
    designKeyFromTemplate(templateId);

  const busy = exportStatus === 'capturing' || exportStatus === 'exporting';

  async function onPrimary(): Promise<void> {
    if (plan === 'free') {
      dispatch(selectTemplate(TemplateId.MODERN_CLEAN));
      if (authStatus !== 'authenticated') {
        router.push('/login?next=/download');
        return;
      }
      // Let the A4 preview re-render on Kagaz before capture
      await new Promise((resolve) => setTimeout(resolve, 120));
      await exportAs(ExportFormat.PDF);
      return;
    }

    if (!isPremium) {
      router.push('/wedding-pass');
      return;
    }

    if (authStatus !== 'authenticated') {
      router.push('/login?next=/download');
      return;
    }

    await exportAs(ExportFormat.PDF);
  }

  const primaryLabel = (() => {
    if (busy) return 'Preparing download…';
    if (plan === 'free') return 'Download free PDF';
    if (isPremium) return 'Download PDF & image';
    return 'Pay with UPI and download';
  })();

  return (
    <div className="dl-card">
      <b>Choose your download</b>

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

      {plan === 'premium' && !isPremium ? (
        <span className="dl-pay-note">
          GPay, PhonePe, Paytm or any UPI app. Downloads start right after payment via{' '}
          <Link href="/wedding-pass">Wedding Pass</Link>.
        </span>
      ) : (
        <span className="dl-pay-note">
          Downloads start on this device. You can re-open the file anytime.
        </span>
      )}

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
